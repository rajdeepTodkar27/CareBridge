"use client"
import React, { useState, useEffect } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/libs/ui/card"
import { Input } from "@/libs/ui/shadcn/input"
import { Button } from "@/libs/ui/shadcn/button"
import axios from "axios"
import { useSession } from "next-auth/react"
type subscriptionPlans = {
    _id: string;
    planName: string;
    description: string;
    billingCycle: string;
    pharmacyDiscount: number;
    freeConsultions: number;
    price: number;
    isActive: boolean
}
interface RazorpayOptions {
    key: string
    amount: number // in paise (e.g., 99900 for ₹999.00)
    currency: string
    name: string
    description: string
    image?: string
    order_id?: string
    handler: (response: any) => void
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    notes?: any
    theme?: {
        color: string
    }
}

const SubscriptionPage: React.FC = () => {
    const [plan, setPlan] = useState<subscriptionPlans[]>([])
    const [email, setEmail] = useState("")
    const { data: session } = useSession()
    const [selectedPlan, setselectedPlan] = useState<subscriptionPlans | null>(null)


    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
    }, [session, setEmail]);

    useEffect(() => {
        const getplansdetails = async () => {
            try {
                const res = await axios.get("/api/subscription-plans")
                setPlan(res.data.data)
                setselectedPlan(res.data.data[0])
            } catch (error) {
                console.log("failed to fetch the subscription plans");

            }
        }
        getplansdetails()
    }, [setPlan])

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
    }, [])

    const openRazorpayCheckout  = async () => {
        try {
            // 🔁 Step 1: Create Razorpay order via backend
            const { data: order } = await axios.post("/api/payment/create-razorpay-order", {
                amount: selectedPlan?.price,
            })

            // 🔁 Step 2: Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: "CareBridge",
                description: "Subscription Plan",
                order_id: order.id,
                handler: async (response: any) => {
                   
                    try {
                       
                        const verifyRes = await axios.post("/api/payment/verify-razorpay-payment", response)

                        if (!verifyRes.data.success) {
                            alert("Payment verification failed.")
                            return
                        }

                        const subscribeRes = await axios.post("/api/patient/subscribe", {
                            plan: selectedPlan?._id,            
                            billingCycle: selectedPlan?.billingCycle,    
                            paymentId: response.razorpay_payment_id,
                            paymentMethod: "razorpay",
                            price: selectedPlan?.price,
                        })

                       alert("successfully subscribed membership")
                    } catch (error) {
                        console.error("Subscription error:", error)
                        alert("Something went wrong. Please contact support.")
                    }
                },
                prefill: {
                    email: email,
                },
                theme: { color: "#607afb" },
            }

            const razorpay = new (window as any).Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error("Razorpay Error:", error)
            alert("Something went wrong with the payment")
        }
    }
    
    const handlesubmit =()=>{
        openRazorpayCheckout()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4 py-10">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Start Your Membership</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <p className="text-base font-medium pb-2 text-[#0d0f1c]">Email</p>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 placeholder:text-[#47569e] text-[#0d0f1c]"
                            readOnly
                        />
                    </div>

                    {/* Plan Selection */}
                    <div>
                        <p className="text-base font-bold pb-2 text-[#0d0f1c]">Choose a Plan</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plan.map((option: subscriptionPlans) => (
                                <label
                                    key={option._id}
                                    className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${selectedPlan === option
                                        ? "border-green-500 bg-green-50"
                                        : "border-[#ced2e9] bg-white"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="subscription"
                                        checked={selectedPlan === option}
                                        onChange={() => setselectedPlan(option)}
                                        className="h-5 w-5 text-green-400 border-[#ced2e9] accent-green-600"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-sm tracking-widest title-font mb-1 font-medium">{option.planName}</p>
                                        <p className="text-sm text-[#47569e]">Rs{option.price} / {option.billingCycle}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full h-12 bg-green-500 text-white font-bold hover:bg-green-700 cursor-pointer"
                        onClick={handlesubmit}
                    >
                        Pay Now
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SubscriptionPage
