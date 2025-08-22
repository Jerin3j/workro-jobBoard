"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export async function handlePayment(
  pricingTier: any,
  jobId: string,
  router: any
) {
  try {
    //POST req for Free Listing
    let isFree = false;
    if (String(pricingTier.price) === "Free") {
      isFree = true;

      const verifyResponse = await fetch("/api/payment-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, isFree }),
      });

      const verifyDataFree = await verifyResponse.json();
      console.log("Free Listing Verification Response:", verifyDataFree);

      if (verifyResponse.ok) {
        router.push("/");
      }
      return;
    }

    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: pricingTier.price, jobId }),
    });

    const data = await response.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: "INR",
      name: "Workro!",
      description: pricingTier.description,
      order_id: data.orderId,
      notes: { jobId },
      handler: async function (response: any) {
        console.log(" Payment Successful:", response);

        //POST req for Paid Listing
        try {
          const verifyResponse = await fetch("/api/payment-verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, jobId, isFree: false }), // False for paid listings
          });

          const verifyData = await verifyResponse.json();
          console.log("Verification Response Data:", verifyData);

          if (verifyResponse.ok) {
            // router.push("/payment-success");
            window.location.href = "/payment-success";
          } else {
            router.push("/payment-failed");
          }
        } catch (error) {
          console.error(" Error verifying payment:", error);
        }
      },
      prefill: {
        name: "Jerin 3j",
        email: "jerin3j@gmail.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpl = new window.Razorpay(options);
    rzpl.open();
  } catch (error) {
    console.error(" Payment failed:", error);
  }
}
