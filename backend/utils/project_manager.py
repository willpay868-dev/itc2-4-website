"""
Project Manager for Real Estate Lead Organization
Adapted from ada_v2's project_manager for lead management
"""
import os
import json
import shutil
import time
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime


class LeadProjectManager:
    """Manage real estate leads organized by projects/campaigns"""

    def __init__(self, workspace_root: str = None):
        if workspace_root is None:
            workspace_root = Path(__file__).parent.parent

        self.workspace_root = Path(workspace_root)
        self.projects_dir = self.workspace_root / "projects"
        self.current_project = "default"

        # Ensure projects root exists
        if not self.projects_dir.exists():
            self.projects_dir.mkdir(parents=True)

        # Ensure default project exists
        self.create_project("default")

    def create_project(self, name: str) -> tuple:
        """
        Creates a new project directory with subfolders for leads

        Args:
            name: Project name (e.g., "Brooklyn_Q1_2024", "Manhattan_Deals")

        Returns:
            (success: bool, message: str)
        """
        # Sanitize name to be safe for filesystem
        safe_name = "".join([c for c in name if c.isalnum() or c in (' ', '-', '_')]).strip()
        if not safe_name:
            return False, "Invalid project name"

        project_path = self.projects_dir / safe_name

        if not project_path.exists():
            project_path.mkdir()
            (project_path / "leads").mkdir()
            (project_path / "outreach").mkdir()
            (project_path / "analysis").mkdir()
            (project_path / "documents").mkdir()

            # Create project metadata
            metadata = {
                "name": safe_name,
                "created_at": datetime.now().isoformat(),
                "total_leads": 0,
                "status": "active"
            }

            with open(project_path / "project.json", 'w') as f:
                json.dump(metadata, f, indent=2)

            print(f"[ProjectManager] Created project: {safe_name}")
            return True, f"Project '{safe_name}' created."

        return False, f"Project '{safe_name}' already exists."

    def switch_project(self, name: str) -> tuple:
        """
        Switches the active project context

        Args:
            name: Project name to switch to

        Returns:
            (success: bool, message: str)
        """
        safe_name = "".join([c for c in name if c.isalnum() or c in (' ', '-', '_')]).strip()
        project_path = self.projects_dir / safe_name

        if project_path.exists():
            self.current_project = safe_name
            print(f"[ProjectManager] Switched to project: {safe_name}")
            return True, f"Switched to project '{safe_name}'."

        return False, f"Project '{safe_name}' does not exist."

    def list_projects(self) -> List[str]:
        """Returns a list of available projects"""
        return [d.name for d in self.projects_dir.iterdir() if d.is_dir()]

    def get_current_project_path(self) -> Path:
        """Get the path to the current project"""
        return self.projects_dir / self.current_project

    def save_lead(self, lead_data: Dict) -> Optional[str]:
        """
        Save a lead to the current project

        Args:
            lead_data: Dictionary containing lead information

        Returns:
            Path to saved lead file or None on error
        """
        project_path = self.get_current_project_path()
        leads_dir = project_path / "leads"

        # Generate filename
        timestamp = int(time.time())
        address = lead_data.get('address', 'unknown')
        safe_address = "".join([c for c in address if c.isalnum() or c in (' ', '-', '_')])[:50].strip().replace(" ", "_")
        filename = f"{timestamp}_{safe_address}.json"

        lead_file = leads_dir / filename

        try:
            # Add metadata
            lead_data['saved_at'] = datetime.now().isoformat()
            lead_data['project'] = self.current_project

            with open(lead_file, 'w', encoding='utf-8') as f:
                json.dump(lead_data, f, indent=2)

            print(f"[ProjectManager] Saved lead: {lead_file.name}")

            # Update project metadata
            self._update_project_stats()

            return str(lead_file)

        except Exception as e:
            print(f"[ProjectManager] Error saving lead: {e}")
            return None

    def get_all_leads(self) -> List[Dict]:
        """Get all leads from the current project"""
        leads_dir = self.get_current_project_path() / "leads"
        leads = []

        if not leads_dir.exists():
            return leads

        for lead_file in leads_dir.glob("*.json"):
            try:
                with open(lead_file, 'r', encoding='utf-8') as f:
                    lead_data = json.load(f)
                    lead_data['_file'] = lead_file.name
                    leads.append(lead_data)
            except Exception as e:
                print(f"[ProjectManager] Error reading {lead_file.name}: {e}")

        # Sort by timestamp (newest first)
        leads.sort(key=lambda x: x.get('saved_at', ''), reverse=True)

        return leads

    def save_outreach_message(self, address: str, message: str, metadata: Dict = None) -> Optional[str]:
        """
        Save an outreach message for a property

        Args:
            address: Property address
            message: Outreach message content
            metadata: Additional metadata (owner, ROI data, etc.)

        Returns:
            Path to saved message or None on error
        """
        outreach_dir = self.get_current_project_path() / "outreach"

        timestamp = int(time.time())
        safe_address = "".join([c for c in address if c.isalnum() or c in (' ', '-', '_')])[:50].strip().replace(" ", "_")
        filename = f"{timestamp}_{safe_address}.json"

        outreach_file = outreach_dir / filename

        try:
            data = {
                'address': address,
                'message': message,
                'created_at': datetime.now().isoformat(),
                'status': 'draft',
                'metadata': metadata or {}
            }

            with open(outreach_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)

            print(f"[ProjectManager] Saved outreach: {outreach_file.name}")
            return str(outreach_file)

        except Exception as e:
            print(f"[ProjectManager] Error saving outreach: {e}")
            return None

    def save_roi_analysis(self, address: str, analysis: Dict) -> Optional[str]:
        """
        Save ROI analysis for a property

        Args:
            address: Property address
            analysis: ROI analysis dictionary

        Returns:
            Path to saved analysis or None on error
        """
        analysis_dir = self.get_current_project_path() / "analysis"

        timestamp = int(time.time())
        safe_address = "".join([c for c in address if c.isalnum() or c in (' ', '-', '_')])[:50].strip().replace(" ", "_")
        filename = f"{timestamp}_{safe_address}.json"

        analysis_file = analysis_dir / filename

        try:
            analysis['saved_at'] = datetime.now().isoformat()
            analysis['address'] = address

            with open(analysis_file, 'w', encoding='utf-8') as f:
                json.dump(analysis, f, indent=2)

            print(f"[ProjectManager] Saved analysis: {analysis_file.name}")
            return str(analysis_file)

        except Exception as e:
            print(f"[ProjectManager] Error saving analysis: {e}")
            return None

    def get_project_summary(self) -> Dict:
        """Get a summary of the current project"""
        project_path = self.get_current_project_path()

        # Count leads
        leads_dir = project_path / "leads"
        num_leads = len(list(leads_dir.glob("*.json"))) if leads_dir.exists() else 0

        # Count outreach messages
        outreach_dir = project_path / "outreach"
        num_outreach = len(list(outreach_dir.glob("*.json"))) if outreach_dir.exists() else 0

        # Count analyses
        analysis_dir = project_path / "analysis"
        num_analyses = len(list(analysis_dir.glob("*.json"))) if analysis_dir.exists() else 0

        # Load project metadata
        metadata_file = project_path / "project.json"
        metadata = {}
        if metadata_file.exists():
            try:
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
            except:
                pass

        return {
            'name': self.current_project,
            'path': str(project_path),
            'leads': num_leads,
            'outreach_messages': num_outreach,
            'roi_analyses': num_analyses,
            'metadata': metadata
        }

    def _update_project_stats(self):
        """Update project statistics"""
        project_path = self.get_current_project_path()
        metadata_file = project_path / "project.json"

        metadata = {}
        if metadata_file.exists():
            try:
                with open(metadata_file, 'r') as f:
                    metadata = json.load(f)
            except:
                pass

        # Update stats
        leads_dir = project_path / "leads"
        metadata['total_leads'] = len(list(leads_dir.glob("*.json"))) if leads_dir.exists() else 0
        metadata['last_updated'] = datetime.now().isoformat()

        # Save
        try:
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
        except Exception as e:
            print(f"[ProjectManager] Error updating stats: {e}")

    def export_project(self, export_path: str = None) -> Optional[str]:
        """
        Export the current project to a zip file

        Args:
            export_path: Path where to save the export (optional)

        Returns:
            Path to exported file or None on error
        """
        project_path = self.get_current_project_path()

        if export_path is None:
            export_path = self.workspace_root / f"{self.current_project}_{int(time.time())}.zip"

        try:
            import zipfile

            with zipfile.ZipFile(export_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(project_path):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, project_path.parent)
                        zipf.write(file_path, arcname)

            print(f"[ProjectManager] Exported project to: {export_path}")
            return str(export_path)

        except Exception as e:
            print(f"[ProjectManager] Error exporting project: {e}")
            return None

    def search_leads(self, query: str) -> List[Dict]:
        """
        Search for leads matching a query

        Args:
            query: Search query (searches in address, owner, notes)

        Returns:
            List of matching leads
        """
        all_leads = self.get_all_leads()
        query_lower = query.lower()

        matching_leads = []
        for lead in all_leads:
            # Search in address
            if query_lower in lead.get('address', '').lower():
                matching_leads.append(lead)
                continue

            # Search in owner
            if query_lower in lead.get('owner', '').lower():
                matching_leads.append(lead)
                continue

            # Search in notes/metadata
            metadata_str = json.dumps(lead).lower()
            if query_lower in metadata_str:
                matching_leads.append(lead)

        return matching_leads
