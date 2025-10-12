import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi2";

const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* feature1 */}
            <div className="flex flex-col items-center">
                <div className="text-xl">
                    <HiShoppingBag className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">
                    FREE INTERNATIONAL SHIPPING
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    On all orders over $100.00
                </p>
            </div>

            {/* feature2 */}
            <div className="flex flex-col items-center">
                <div className="text-xl">
                    <HiArrowPathRoundedSquare className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">
                    45 DAYS RETURN
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    Money back guaranteed
                </p>
            </div>

            {/* feature3 */}
            <div className="flex flex-col items-center">
                <div className="text-xl">
                    <HiOutlineCreditCard className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">
                    SECURE CHECKOUT
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    100% secured checkout process
                </p>
            </div>
        </div>
    </section>
  )
}

export default FeaturesSection