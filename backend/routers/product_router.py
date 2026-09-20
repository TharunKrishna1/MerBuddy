from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from services.product_service import product_service

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("/search")
async def search_products(
    q: str = Query("", alias="q"),
    category: Optional[str] = None,
    color: Optional[str] = None,
    size: Optional[str] = None
):
    try:
        products = await product_service.search_products(q, category, color, size)
        return {"success": True, "count": len(products), "data": [p.model_dump() for p in products]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_products():
    try:
        products = await product_service.get_products()
        return {"success": True, "count": len(products), "data": [p.model_dump() for p in products]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}")
async def get_product_by_id(product_id: str):
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "data": product.model_dump()}
