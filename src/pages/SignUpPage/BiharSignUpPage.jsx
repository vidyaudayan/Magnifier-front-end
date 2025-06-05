import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../../componenets/Welcome/button";
import { Card, CardContent } from "../../componenets/Welcome/card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../componenets/Welcome/select";
import { useNavigate,useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserDetails } from "../../features/user/userSlice";


const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    fatherName: z.string().min(2, "Father's name must be at least 2 characters"),
    dateOfBirth: z.date().max(new Date(), "Date of birth cannot be in the future"),
    gender: z.string().min(1, "Please select a gender"),
    vidhanSabha: z.string().min(1, "Vidhan Sabha is required"),
    wardNumber: z.string().min(1, "Ward number is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const BiharSignUpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wardOptions, setWardOptions] = useState([]);
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(signUpSchema),
    });

    const dispatch = useDispatch();
    const state = new URLSearchParams(location.search).get("state")|| "Bihar" ;

    // Vidhan Sabha options
    const [vidhanSabhaOptions, setVidhanSabhaOptions] = useState([]);

    // Populate constituency options based on state
    useEffect(() => {
        const stateConstituencies = {
            Delhi: [
                "Adarsh Nagar", "Ambedkar Nagar", "Babarpur", "Badarpur", "Badli", "Ballimaran",
                "Bawana", "Bijwasan", "Burari", "Chandni Chowk", "Chhatarpur", "Deoli",
                "Delhi Cantonment", "Dwarka", "Gandhi Nagar", "Ghonda", "Gokalpur", "Greater Kailash",
                "Hari Nagar", "Janakpuri", "Jangpura", "Karawal Nagar", "Karol Bagh", "Kasturba Nagar",
                "Kalkaji", "Kirari", "Kondli", "Krishna Nagar", "Laxmi Nagar", "Madipur",
                "Malviya Nagar", "Mangolpuri", "Matiala", "Matia Mahal", "Mehrauli", "Model Town",
                "Moti Nagar", "Mundka", "Mustafabad", "Najafgarh", "Nangloi Jat", "Narela",
                "New Delhi", "Okhla", "Palam", "Patel Nagar", "Patparganj", "Rajinder Nagar",
                "Rajouri Garden", "Rithala", "Rohini", "R.K. Puram", "Sadar Bazar", "Sangam Vihar",
                "Seelampur", "Seemapuri", "Shahdara", "Shakur Basti", "Shalimar Bagh", "Sultanpur Majra",
                "Tilak Nagar", "Timarpur", "Tri Nagar", "Trilokpuri", "Tughlakabad", "Uttam Nagar",
                "Vikaspuri", "Vishwas Nagar", "Wazirpur"],
                Bihar: [
                    "Adhaura", "Agiaon", "Alamnagar", "Amarpur", "Amour", "Amdabad", "Arah",
                    "Araria", "Arwal", "Aurangabad", "Bagaha", "Bahadurganj",
                    "Bajpatti", "Bakhtiarpur", "Banka", "Bankipur", "Banmankhi", "Barahat",
                    "Barari", "Barbigha", "Barhara", "Barh", "Barachatti", "Bariarpur",
                    "Bathnaha", "Baisi", "Belaganj", "Belhar", "Belsand", "Benipatti",
                    "Bettiah", "Bhabua", "Bihpur", "Bihariganj", "Bikram", "Bisfi", "Bodh Gaya",
                    "Brahmpur", "Buxar", "Chanpatia", "Chakai", "Chainpur", "Chhatapur", "Chiraiya",
                    "Chenari", "Colgong", "Danapur", "Darauli", "Dehri", "Dhamdaha", "Dhaka",
                    "Digha", "Dumraon", "Fatuha", "Forbesganj", "Gaya", "Gaya Town",
                    "Ghosi", "Gobindpur", "Govindganj", "Gurua", "Hajipur", "Harsidhi", "Harlakhi",
                    "Hisua", "Imamganj", "Islampur", "Jamui", "Jehanabad", "Jagdishpur",
                    "Jhanjharpur", "Jhajha", "Jokihat", "Kahalgaon", "Kalyanpur",
                    "Kasba", "Katihar", "Kargahar", "Karakat", "Kesaria", "Khajauli", "Kishanganj",
                    "Korha", "Kurtha", "Kutumba", " Lakhisarai", "Lauriya", "Laukaha", "Madhepura",
                    "Madhubani", " Maharajganj", "Mahishi", "Makhdumpur", "Maner", "Manihari", "Masaurhi",
                    "Matihari", "Mohania", "Motihari", "Mokama", "Munger", "Nabinagar",
                    "Narkatia", "Narkatiaganj", "Narpatganj", "Nautan", "Nawada",
                    "Nirmali", "Nokha", "Paliganj", "Parihar", "Patliputra", "Patna Sahib",
                    "Phulparas", "Pirpainti", "Pipra", "Piro", "Pranpur", "Ramnagar",
                    "Rafiganj", "Raghopur", "Rajauli", "Rampur", "Raniganj", "Raxaul",
                    "Riga", "Rupauli", "Runnisaidpur", "Sandesh", "Saharsa", "Sasaram",
                    "Sheikhpura", "Sheohar", "Sherghati", "Shahpur", "Simri Bakhtiyarpur",
                    "Singheshwar", "Sitamarhi", "Sikandra", "Sikta", "Siwan", "Sugauli", "Sultanganj",
                    "Supaul", "Sursand", "Tikari", "Tarari", "Tarapur", "Thakurganj",
                    "Triveniganj", "Ujiarpur", "Valmiki Nagar", "Wazirganj", "Warsaliganj"
    
                ],
         "West Bengal": ["Alipurduars", "Amdanga", "Amta", "Arambagh", "Asansol Dakshin", "Asansol Uttar",
                "Ashoknagar", "Ausgram", "Bagnan", "Bagda", "Baghmundi", "Baharampur", "Balarampur", "Bally", "Balurghat", "Bamangola", "Baneswar", "Banipur",
                "Bankura", "Bansberia", "Bansihari", "Barabani", "Barasat", "Bardhaman Dakshin", "Bardhaman Uttar", "Barjora", "Barrackpore", "Baruipur Paschim", "Baruipur Purba", "Basanti", "Basirhat Dakshin",
                "Basirhat Uttar", "Beldanga", "Beldih", "Behala Paschim", "Behala Purba", "Bhabanipur", "Bhatar", "Bhatpara", "Bhawanipur", "Bidhannagar", "Binpur", "Bishnupur",
                "Bolpur", "Bongaon Dakshin", "Bongaon Uttar", "Bowbazar", "Burdwan Dakshin", "Burdwan Uttar", "Burwan", "Canning Paschim", "Canning Purba",
                "Chakdaha", "Champdani", "Chandannagar", "Chandipur", "Chanditala", "Chandrakona", "Chapra", "Chhatna", "Chinsurah", "Chopra", "Contai Dakshin", "Contai Uttar", "Cooch Behar Dakshin",
                "Cooch Behar Uttar", "Dabgram", "Dakshin Dinajpur", "Dantan", "Darjeeling", "Daspur", "Debra", "Deganga",
                "Dhaniakhali", "Dhupguri", "Diamond Harbour", "Dinhata", "Domjur", "Dubrajpur", "Dum Dum", "Durgapur Paschim", "Durgapur Purba", "Egra", "Englishbazar", "Falta", "Farakka", "Gaighata",
                "Galsi", "Gangajalghati", "Gangarampur", "Garhbeta", "Gazole", "Ghatal", "Goalpokhar", "Gopiballavpur", "Gosaba", "Habibpur",
                "Haldia", "Hariharpara", "Haripal", "Harishchandrapur", "Harirampur", "Hasnabad", "Hemtabad", "Hingalganj", "Howrah Dakshin", "Howrah Madhya", "Howrah Uttar", "Ilambazar", "Indas",
                "Islampur", "Itahar", "Jadavpur", "Jagatballavpur", "Jalangi", "Jalpaiguri", "Jamalpur", "Jangipara", "Jangipur", "Jaynagar", "Jhalda", "Jhargram", "Jorebunglow", "Joypur", "Kakdwip", "Kalchini",
                "Kaliaganj", "Kaliganj", "Kalimpong", "Kalyani", "Kamarhati", "Kandi", "Kanksa", "Karandighi", "Kasba", "Katwa", "Keshpur", "Ketugram", "Khanakul", "Khandaghosh", "Kharagpur", "Kharagpur Sadar", "Khardaha",
                "Khatra", "Khejuri", "Kolkata Port", "Kotulpur", "Krishnaganj", "Krishnanagar Dakshin", "Krishnanagar Uttar", "Kulpi", "Kumarganj", "Kumargram", "Kurseong", "Labpur",
                "Lalgola", "Madarihat", "Magrahat Paschim", "Magrahat Purba", "Mahisadal", "Mainaguri", "Mal", "Malatipur", "Manbazar", "Mandirbazar", "Mangalkot", "Manikchak", "Manteswar", "Mathabhanga", "Mathurapur", "Matigara",
                "Maynaguri", "Mayureswar", "Mejhia", "Memari", "Mekliganj", "Midnapore", "Minakhan", "Mothabari", "Murshidabad", "Nabadwip", "Nabagram", "Nalhati",
                "Nandakumar", "Nandigram", "Nanoor", "Naoda", "Narayangarh", "Naxalbari", "Nayagram", "Neturia", "New Barrackpore", "Nimpith", "Noapara", "Nokpul", "North Barrackpore", "North Dum Dum", "Onda", "Palashi", "Pandabeswar", "Pandua",
                "Panihati", "Panskura Paschim", "Panskura Purba", "Para", "Paschim Medinipur", "Patashpur", "Patrasayer", "Purbasthali Dakshin", "Purbasthali Uttar", "Purulia", "Raghunathganj",
                "Raghunathpur", "Raiganj", "Raina", "Rajarhat", "Rajganj", "Rajmahal",
                "Rajnagar", "Ramnagar", "Rampurhat", "Ranaghat Dakshin", "Ranaghat Uttar", "Rangli Rangliot", "Ranibandh", "Raniganj", "Rashbehari",
                "Ratua", "Sabang", "Sagar", "Sagardighi", "Sahapur", "Sainthia", "Salboni", "Saltora", "Samserganj", "Sandeshkhali", "Sankrail", "Santipur", "Santuri", "Sarenga", "Shyampur", "Siliguri", "Sitai", "Sitalkuchi",
                "Sonamukhi", "Sonarpur Dakshin", "Sonarpur Uttar", "South Dum Dum", "Sreerampur", "Sujapur", "Sultanganj", "Suri",
                "Swangrampur", "Taldangra", "Tamluk", "Tarakeswar", "Tehatta", "Thakurpukur", "Tufanganj", "Tulin", "Udaynarayanpur", "Uluberia Dakshin", "Uluberia Uttar", "Uttar Dinajpur",
            ],
        };
        
        const stateWards = {
          Delhi: Array.from({ length: 500 }, (_, i) => i + 1),
          Bihar: Array.from({ length: 300 }, (_, i) => i + 1),
          "West Bengal": Array.from({ length: 400 }, (_, i) => i + 1)
        };
    
        setVidhanSabhaOptions(stateConstituencies[state] || []);
        setWardOptions(stateWards[state] || []);
      }, [state])

    // Populate Vidhan Sabha options
    

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const payload = {
                ...data,
                state, 
                phoneNumber: data.phone,
                age: calculateAge(data.dateOfBirth),
                wardNumber: data.wardNumber ? Number(data.wardNumber) : null
              };
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/signup`, payload, {
                withCredentials: true,
            })
            const { token, user } = res.data;
            if (res.data.token) {
                localStorage.setItem('token', res.data.token); 
               
                reset();
              
            }
            dispatch(setUserDetails(user));
            console.log("res data", res);
            toast.success("Signup completed! please verify your email and mobile for login ");

            alert("signup sucess")
            //navigate("/verify");
            navigate("/livefeed/*");

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("User already exists. Please use a different email.");
            } else {
                toast.error("Signup failed. Please try again.");
            }
            console.log(error);

        } finally {
            setIsSubmitting(false);
          }

    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* <Button
                    onClick={() => navigate("/")}
                    className="mb-6 flex bg-blue-900 items-center gap-2 hover:bg-white hover:text-blue-900 border hover:border-slate-300"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button> */}
            <div className="max-w-3xl mx-auto">
               

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join our platform to start your political journey
                    </p>
                </div>

                <Card className="rounded-lg shadow-lg">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name and Username */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        {...register("username")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.username && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Father's Name and DOB */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Father's Name
                                    </label>
                                    <input
                                        type="text"
                                        {...register("fatherName")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.fatherName && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.fatherName.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date of Birth
                                    </label>
                                    <DatePicker
                                        selected={watch("dateOfBirth")}
                                        onChange={(date) => setValue("dateOfBirth", date)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        maxDate={new Date()}
                                        showYearDropdown
                                        dropdownMode="select"
                                    />
                                    {errors.dateOfBirth && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.dateOfBirth.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Gender and Constituency */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Gender
                                    </label>
                                    <Select onValueChange={(value) => setValue("gender", value)}>
                                        <SelectTrigger className="mt-1 w-full h-10 px-3 py-2 text-left bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.gender.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Vidhansabha
                                    </label>
                                    <Select onValueChange={(value) => setValue("vidhanSabha", value)}>
                                        <SelectTrigger className="mt-1 w-full h-10 px-3 py-2 text-left bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <SelectValue placeholder="Select Vidhan Sabha" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                                            {vidhanSabhaOptions.map((option, index) => (
                                                <SelectItem key={index} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vidhanSabha && (
  <p className="mt-1 text-sm text-red-600">
    {errors.vidhanSabha.message}
  </p>
)}
                                </div>
                            </div>

                            {/* Ward Number and Email */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ward Number
                                    </label>
                                    <Select onValueChange={(value) => setValue("wardNumber", value)}>
                                        <SelectTrigger className="mt-1 w-full h-10 px-3 py-2 text-left bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                            <SelectValue placeholder="Select Ward Number" />
                                        </SelectTrigger>
                                        <SelectContent className="z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                                            {Array.from({ length: 500 }, (_, i) => i + 1).map((num) => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.wardNumber && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.wardNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone and Password */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        {...register("phone")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        {...register("password")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    type="submit" disabled={isSubmitting}
                                    className="px-8 py-2 h-11 rounded-[29px] font-medium text-white text-sm tracking-[-0.14px] [background:linear-gradient(180deg,rgba(145,187,255,1)_0%,rgba(101,151,255,1)_100%)]"
                                >
                                  {isSubmitting ? "Processing..." : "Sign up"}
                                </Button>
                            </div>
                            <div className="text-center">
                                <p className="text-sm">If you are already registered, Please <Link to="/login" className="text-blue-500 font-medium cursor-pointer"> Login</Link></p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};