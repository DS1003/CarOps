import { getProducts } from "@/app/actions/products";
import { ProductList } from "@/components/dashboard/product-list";

export default async function AdminProductPage() {
    const productsResult = await getProducts();
    const products = productsResult.success ? productsResult.data : [];

    return (
        <div className="bg-gray-50/30 min-h-screen">
            <ProductList initialProducts={products || []} />
        </div>
    );
}
