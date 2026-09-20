from typing import Optional, List
from fastapi import APIRouter, HTTPException
from schemas import Merchant
from data.mock_merchants import mock_merchants
from datetime import datetime

router = APIRouter(prefix="/api/merchants", tags=["Merchants"])
merchants_db: List[Merchant] = list(mock_merchants)

@router.get("")
def get_merchants():
    return {"success": True, "count": len(merchants_db), "data": [m.model_dump() for m in merchants_db]}

@router.get("/{merchant_id}")
def get_merchant_by_id(merchant_id: str):
    m = next((item for item in merchants_db if item.id == merchant_id), None)
    if not m:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return {"success": True, "data": m.model_dump()}

@router.post("")
def create_merchant(merchant: Merchant):
    merchants_db.append(merchant)
    return {"success": True, "data": merchant.model_dump()}

@router.put("/{merchant_id}")
def update_merchant(merchant_id: str, payload: dict):
    idx = next((i for i, m in enumerate(merchants_db) if m.id == merchant_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="Merchant not found")

    existing = merchants_db[idx].model_dump()
    existing.update(payload)
    existing["updatedAt"] = datetime.utcnow().isoformat()

    updated = Merchant(**existing)
    merchants_db[idx] = updated
    return {"success": True, "data": updated.model_dump()}
