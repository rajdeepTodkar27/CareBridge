"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

interface SubscriptionPlan {
  planName: string;
  freeConsultions: number;
  price: number;
}

interface Subscription {
  plan: SubscriptionPlan;
  startingDate: string;
  endingDate: string;
  availableFreeConsultions: number;
  pharmacyDiscount: number;
  status: "active" | "expired" | "cancelled";
  paymentMethod: "razorpay" | "cash";
  paymentId?: string;
}

export default function MembershipPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await axios.get("/api/patient/subscribe");
        setSubscription(res.data.data);
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading membership details...</div>;

  if (!subscription) {
    return (
      <div className="p-6 text-center text-gray-500">
        No active subscription found.
      </div>
    );
  }

  const statusStyles = {
    active: "bg-green-100 text-green-700 border-green-300",
    expired: "bg-yellow-100 text-yellow-700 border-yellow-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 px-6 py-8 transition hover:shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{subscription.plan.planName}</h1>
            
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${statusStyles[subscription.status]}`}>
            {subscription.status}
          </span>
        </div>

        {/* Subscription Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium text-gray-800">{format(new Date(subscription.startingDate), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500">End Date</p>
            <p className="font-medium text-gray-800">{format(new Date(subscription.endingDate), "dd MMM yyyy")}</p>
          </div>
          <div>
            <p className="text-gray-500">Available Free Consultations</p>
            <p className="font-medium text-gray-800">{subscription.availableFreeConsultions}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Free Consultations</p>
            <p className="font-medium text-gray-800">{subscription.plan.freeConsultions}</p>
          </div>
          <div>
            <p className="text-gray-500">Pharmacy Discount</p>
            <p className="font-medium text-gray-800">{subscription.pharmacyDiscount}%</p>
          </div>
          <div>
            <p className="text-gray-500">Plan Price</p>
            <p className="font-medium text-gray-800">₹{subscription.plan.price}</p>
          </div>
         
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p className="font-medium text-gray-800 capitalize">{subscription.paymentMethod}</p>
          </div>
          {subscription.paymentId && (
            <div>
              <p className="text-gray-500">Payment ID</p>
              <p className="font-medium text-gray-800">{subscription.paymentId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
