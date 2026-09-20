from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.pricing_service import pricing_service
from services.discount_service import discount_service

router = APIRouter(tags=["Pricing & Discounts"])

class CalcPriceReq(BaseModel):
    originalPrice: float
    currency: Optional[str] = "INR"
    discountPercentage: Optional[float] = None

class ApplyDiscountReq(BaseModel):
    merchantId: Optional[str] = "merchant_001"
    couponCode: str
    orderValue: float

@router.post("/api/pricing/calculate")
def calculate_price(req: CalcPriceReq):
    res = pricing_service.calculate_price(req.originalPrice, req.currency or "INR", None, req.discountPercentage)
    return {"success": True, "data": res.model_dump()}

@router.post("/api/discounts/apply")
def apply_discount(req: ApplyDiscountReq):
    if not req.couponCode or req.orderValue is None:
        raise HTTPException(status_code=400, detail="couponCode and orderValue are required.")

    is_valid, rule, msg = discount_service.validate_coupon(req.merchantId or "merchant_001", req.couponCode, req.orderValue)
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    res = pricing_service.calculate_price(req.orderValue, "INR", rule)
    return {"success": True, "message": msg, "data": res.model_dump()}
