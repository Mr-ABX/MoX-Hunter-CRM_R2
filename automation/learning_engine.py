import json
import os
from datetime import datetime
from typing import Dict, Any, List

LEDGER_PATH = "/Volumes/WORK/ABX-2 (CODE AND PROJECTS)/Antigravity Projects-02/The Anti-Gravity Automations/MoX Hunter R2 + Antigravity Flow/.agents/memory/learning_ledger.json"

def load_memory() -> Dict[str, Any]:
    """Loads persistent agent memory and market intelligence."""
    if os.path.exists(LEDGER_PATH):
        with open(LEDGER_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def record_learning(campaign_data: Dict[str, Any]):
    """Records a new campaign outcome and learned insights into persistent memory."""
    memory = load_memory()
    if "historical_campaign_logs" not in memory:
        memory["historical_campaign_logs"] = []
    
    memory["historical_campaign_logs"].append(campaign_data)
    memory["last_updated"] = datetime.utcnow().isoformat() + "Z"
    
    with open(LEDGER_PATH, 'w', encoding='utf-8') as f:
        json.dump(memory, f, indent=2)
    print("✓ Campaign outcome and learnings recorded to persistent agent memory.")

def get_daily_recommendations() -> Dict[str, Any]:
    """Provides smart market recommendations based on learned data and current time."""
    memory = load_memory()
    return {
        "user_preferences": memory.get("user_preferences"),
        "top_pakistan_targets": memory.get("market_intelligence", {}).get("pakistan_high_converting_regions", []),
        "top_us_uk_targets": memory.get("market_intelligence", {}).get("us_uk_high_converting_regions", []),
        "best_sending_windows": memory.get("best_sending_windows", {}),
        "winning_archetypes": memory.get("design_inspiration_benchmarks", {}).get("winning_patterns", [])
    }

if __name__ == "__main__":
    recs = get_daily_recommendations()
    print("=== MoX Hunter Self-Learning Market Intelligence ===")
    print(json.dumps(recs, indent=2))
