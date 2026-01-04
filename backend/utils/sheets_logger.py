"""Enhanced Google Sheets logger with multi-sheet support"""
from typing import Any, Dict, Optional
from datetime import datetime

try:
    import gspread
    from google.oauth2.service_account import Credentials
    GSPREAD_AVAILABLE = True
except ImportError:
    GSPREAD_AVAILABLE = False
    print("Warning: gspread not installed. Google Sheets logging will be disabled.")


class GoogleSheetsLogger:
    """Enhanced Google Sheets logger with multi-sheet support"""

    def __init__(self, sheet_id: str, credentials_path: str):
        self.sheet_id = sheet_id
        self.credentials_path = credentials_path
        self.client = None
        self.sheets = {}
        self.enabled = GSPREAD_AVAILABLE and sheet_id and sheet_id != 'your_google_sheet_id_here'

        if not self.enabled:
            print("  Google Sheets logging is disabled (no valid sheet_id or gspread not installed)")

    def initialize(self) -> bool:
        """Initialize connection to Google Sheets"""
        if not self.enabled:
            return False

        try:
            scopes = [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive"
            ]

            creds = Credentials.from_service_account_file(
                self.credentials_path,
                scopes=scopes
            )
            self.client = gspread.authorize(creds)

            # Open workbook
            workbook = self.client.open_by_key(self.sheet_id)

            # Get or create sheets
            self.sheets['leads'] = self._get_or_create_sheet(workbook, "Leads")
            self.sheets['roi_analysis'] = self._get_or_create_sheet(workbook, "ROI Analysis")
            self.sheets['outreach'] = self._get_or_create_sheet(workbook, "Outreach Log")

            # Setup headers if sheets are new
            self._setup_headers()

            return True

        except Exception as e:
            print(f"  Error initializing Google Sheets: {e}")
            self.enabled = False
            return False

    def _get_or_create_sheet(self, workbook, sheet_name: str):
        """Get existing sheet or create new one"""
        try:
            return workbook.worksheet(sheet_name)
        except gspread.exceptions.WorksheetNotFound:
            return workbook.add_worksheet(title=sheet_name, rows=1000, cols=20)

    def _setup_headers(self):
        """Setup headers for each sheet"""
        try:
            # Leads sheet headers
            if self.sheets['leads'].row_values(1) == []:
                self.sheets['leads'].append_row([
                    'Timestamp',
                    'Address',
                    'Owner',
                    'Status',
                    'Estimated Value',
                    'Source'
                ])

            # ROI Analysis sheet headers
            if self.sheets['roi_analysis'].row_values(1) == []:
                self.sheets['roi_analysis'].append_row([
                    'Timestamp',
                    'Address',
                    'Cap Rate (%)',
                    'Estimated Value',
                    'Monthly Rent',
                    'NOI',
                    'Risk Score',
                    'Recommendation'
                ])

            # Outreach sheet headers
            if self.sheets['outreach'].row_values(1) == []:
                self.sheets['outreach'].append_row([
                    'Timestamp',
                    'Address',
                    'Owner',
                    'Message Preview',
                    'Status'
                ])

        except Exception as e:
            print(f"  Error setting up headers: {e}")

    def log_lead(self, lead: Any) -> bool:
        """Log lead across multiple sheets"""
        if not self.enabled:
            return False

        if not self.client:
            if not self.initialize():
                return False

        try:
            # Log to Leads sheet
            leads_row = [
                lead.timestamp,
                lead.address,
                lead.owner,
                lead.status.value,
                lead.estimated_value or "",
                lead.source or ""
            ]
            self.sheets['leads'].append_row(leads_row)

            # Log to ROI Analysis sheet
            if lead.roi_analysis:
                roi_row = [
                    lead.timestamp,
                    lead.address,
                    lead.roi_analysis.get('cap_rate', ''),
                    lead.roi_analysis.get('estimated_value', ''),
                    lead.roi_analysis.get('monthly_rent_estimate', ''),
                    lead.roi_analysis.get('noi', ''),
                    lead.roi_analysis.get('risk_score', ''),
                    lead.roi_analysis.get('recommendation', '')
                ]
                self.sheets['roi_analysis'].append_row(roi_row)

            # Log to Outreach sheet
            if lead.outreach_message:
                message_preview = lead.outreach_message[:200] + "..." if len(lead.outreach_message) > 200 else lead.outreach_message
                outreach_row = [
                    lead.timestamp,
                    lead.address,
                    lead.owner,
                    message_preview,
                    'Drafted'
                ]
                self.sheets['outreach'].append_row(outreach_row)

            print(f"  ✅ Lead logged to Google Sheets: {lead.address}")
            return True

        except Exception as e:
            print(f"  ❌ Error logging lead: {e}")
            return False

    def get_all_leads(self) -> list:
        """Retrieve all leads from the Leads sheet"""
        if not self.enabled or not self.client:
            return []

        try:
            return self.sheets['leads'].get_all_records()
        except Exception as e:
            print(f"Error retrieving leads: {e}")
            return []

    def update_lead_status(self, address: str, new_status: str) -> bool:
        """Update the status of a lead"""
        if not self.enabled or not self.client:
            return False

        try:
            # Find the row with matching address
            cell = self.sheets['leads'].find(address)

            if cell:
                # Update the status column (column 4)
                self.sheets['leads'].update_cell(cell.row, 4, new_status)
                return True

            return False

        except Exception as e:
            print(f"Error updating lead status: {e}")
            return False
