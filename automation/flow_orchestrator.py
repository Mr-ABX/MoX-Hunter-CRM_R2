import json
import urllib.request
import urllib.error
import ssl
import time
import os
import sys
from typing import Dict, Any, List, Optional

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if workspace_dir not in sys.path:
    sys.path.insert(0, workspace_dir)

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

STATE_FILE = os.path.join(workspace_dir, "scratch", "flow_state.json")

class MoXFlowOrchestrator:
    """
    State-machine flow manager for the MoX Hunter Master Flow.
    Enforces Dual Human Checkpoints: Gate 1 (Lead Review) and Gate 2 (Prototype/Pitch Review).
    """

    def __init__(self):
        self.state = self.load_state()

    def load_state(self) -> Dict[str, Any]:
        if os.path.exists(STATE_FILE):
            try:
                with open(STATE_FILE, "r") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "current_stage": "IDLE",
            "scope": {},
            "leads": [],
            "user_notes": {},
            "prototypes": [],
            "outreach_pitches": [],
            "gate1_approved": False,
            "gate2_approved": False,
            "updated_at": time.time()
        }

    def save_state(self):
        os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
        self.state["updated_at"] = time.time()
        with open(STATE_FILE, "w") as f:
            json.dump(self.state, f, indent=2)

    def init_flow(self, target_city: str, niche_strategy: str, filter_mode: str = "Mode A: No Website", batch_size: int = 10) -> Dict[str, Any]:
        """Stage 1: Initialize Discovery Scope"""
        self.state["current_stage"] = "DISCOVERY_INITIALIZED"
        self.state["scope"] = {
            "targetCity": target_city,
            "nicheStrategy": niche_strategy,
            "filterMode": filter_mode,
            "batchSize": batch_size,
            "startedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z")
        }
        self.state["gate1_approved"] = False
        self.state["gate2_approved"] = False
        self.state["leads"] = []
        self.state["prototypes"] = []
        self.state["outreach_pitches"] = []
        self.save_state()
        return self.state["scope"]

    def set_discovered_leads(self, leads: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Stage 2: Populate Scraped & Verified Leads and halt at Gate 1"""
        self.state["leads"] = leads
        self.state["current_stage"] = "GATE_1_WAITING_HUMAN_APPROVAL"
        self.save_state()
        return {
            "status": "GATE_1_READY",
            "leadCount": len(leads),
            "leads": leads
        }

    def approve_gate1(self, user_notes: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Approve Gate 1 and attach optional per-lead custom design/copy notes"""
        self.state["gate1_approved"] = True
        self.state["user_notes"] = user_notes or {}
        self.state["current_stage"] = "PROTOTYPES_SYNTHESIZING"
        self.save_state()
        return {
            "status": "GATE_1_APPROVED",
            "message": "Proceeding to bespoke prototype generation & pitch drafting."
        }

    def set_prototypes_and_pitches(self, prototypes: List[Dict[str, Any]], pitches: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Stage 3: Store Built Prototypes and Pitches and halt at Gate 2"""
        self.state["prototypes"] = prototypes
        self.state["outreach_pitches"] = pitches
        self.state["current_stage"] = "GATE_2_WAITING_HUMAN_APPROVAL"
        self.save_state()
        return {
            "status": "GATE_2_READY",
            "prototypeCount": len(prototypes),
            "pitchCount": len(pitches)
        }

    def approve_gate2(self) -> Dict[str, Any]:
        """Approve Gate 2 to unlock Controlled Drip Sending"""
        self.state["gate2_approved"] = True
        self.state["current_stage"] = "DRIP_DISPATCH_READY"
        self.save_state()
        return {
            "status": "GATE_2_APPROVED",
            "message": "Ready to execute controlled drip dispatch via Composio & WhatsApp."
        }

if __name__ == "__main__":
    orchestrator = MoXFlowOrchestrator()
    print("MoX Flow Orchestrator initialized.")
    print("Current Stage:", orchestrator.state.get("current_stage"))
