interface iAppProps {
    days: number;
    price: number | string;
    description: string;
}
export const jobListingPrices: iAppProps[] = [
    {
      days: 7,
      price: "Free",
      description: "Basic Visibility - Perfect for short-term listings."
    },
    {
        days: 30,
        price: 999,
        description: "Extended Reach - Stay visible for a full month."
      },
      {
        days: 90,
        price: 2499,
        description: "Premium Exposure - Maximize visibility for three months."
      }
  ];
  