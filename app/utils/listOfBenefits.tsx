import {
  Briefcase,
  Heart,
  Umbrella,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
  Bus,
  Utensils,
  Baby,
  Globe,
  Car,
  Banknote,
} from "lucide-react";

interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  { id: "epf", label: "Employee Provident Fund (EPF)", icon: <Briefcase className="w-3 h-3" /> },
  { id: "health_insurance", label: "Health Insurance", icon: <Heart className="w-3 h-3" /> },
  { id: "paid_leaves", label: "Paid Leaves", icon: <Umbrella className="w-3 h-3" /> },
  { id: "festival_bonus", label: "Festival Bonus", icon: <Coins className="w-3 h-3" /> },
  { id: "subsidized_meals", label: "Subsidized Meals", icon: <Utensils className="w-3 h-3" /> },
  { id: "transport_allowance", label: "Transport Allowance", icon: <Bus className="w-3 h-3" /> },
  { id: "work_from_home", label: "Work From Home", icon: <Home className="w-3 h-3" /> },
  { id: "maternity_paternity", label: "Maternity & Paternity Leave", icon: <Baby className="w-3 h-3" /> },
  { id: "corporate_travel", label: "Corporate Travel Perks", icon: <Globe className="w-3 h-3" /> },
  { id: "gratuity", label: "Gratuity Benefits", icon: <Banknote className="w-3 h-3" /> },
  { id: "onsite_opportunities", label: "Onsite Opportunities", icon: <Globe className="w-3 h-3" /> },
  { id: "mental_health", label: "Mental Health Support", icon: <Brain className="w-3 h-3" /> },
  { id: "gym_membership", label: "Free Gym Membership", icon: <Dumbbell className="w-3 h-3" /> },
  { id: "laptop_budget", label: "Laptop & Tech Budget", icon: <MonitorOff className="w-3 h-3" /> },
  { id: "housing_rent", label: "House Rent Allowance (HRA)", icon: <Building className="w-3 h-3" /> },
  { id: "higher_education", label: "Higher Education Sponsorship", icon: <GraduationCap className="w-3 h-3" /> },
  { id: "performance_bonus", label: "Performance-Based Bonus", icon: <PieChart className="w-3 h-3" /> },
  { id: "esop", label: "Employee Stock Ownership Plan (ESOP)", icon: <Coins className="w-3 h-3" /> },
  { id: "4_day_week", label: "4-Day Work Week", icon: <Calendar className="w-3 h-3" /> },
  { id: "no_tracking", label: "No Employee Monitoring", icon: <Shield className="w-3 h-3" /> },
  { id: "retirement_pension", label: "Retirement Pension Plan", icon: <UserCircle className="w-3 h-3" /> },
  { id: "company_vehicle", label: "Company Vehicle", icon: <Car className="w-3 h-3" /> },
  { id: "interest_free_loans", label: "Interest-Free Employee Loans", icon: <Banknote className="w-3 h-3" /> },
  { id: "intern_to_hire", label: "Intern-to-Full-Time Conversion", icon: <UserPlus className="w-3 h-3" /> },
];
