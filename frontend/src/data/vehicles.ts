export const vehicleData = {
  "Two Wheeler": {
    "Yamaha": ["YZF-R15", "MT-15", "FZ", "Fascino", "RayZR", "YZF-R3", "MT-03"],
    "Honda": ["Activa", "Dio", "Shine", "Unicorn", "X-Blade", "CB350", "CBR250R", "Africa Twin"],
    "Bajaj": ["Pulsar 150", "Pulsar 125", "Platina", "CT 100", "Dominar 400", "Dominar 250", "Pulsar RS200", "Pulsar NS200"],
    "TVS": ["Jupiter", "NTORQ", "Apache RTR 160", "Apache RTR 200", "Raider", "Apache RR 310"],
    "Hero": ["Splendor", "Passion", "Glamour", "Xtreme 160R", "Destini"],
    "Suzuki": ["Access 125", "Burgman Street", "Gixxer"],
    "Royal Enfield": ["Classic 350", "Meteor 350", "Interceptor 650", "Himalayan", "Continental GT 650"],
    "KTM": ["390 Duke", "250 Duke", "RC 390", "390 Adventure"],
    "Kawasaki": ["Ninja 300", "Ninja 400", "Z900", "Ninja ZX-10R"],
    "Other": ["Other"]
  },
  "Three Wheeler": {
    "Bajaj": ["RE", "Maxima", "Compact"],
    "Piaggio": ["Ape City", "Ape Xtra", "Ape Auto Plus"],
    "Mahindra": ["Treo", "Alfa", "E-Alfa Mini"],
    "TVS": ["King"],
    "Atul Auto": ["Gem", "Rik"],
    "Other": ["Other"]
  },
  "Car": {
    "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "WagonR", "Alto", "Brezza", "Ertiga", "Fronx"],
    "Hyundai": ["i20", "Grand i10 Nios", "Venue", "Verna", "Aura", "Exter", "Creta", "Alcazar", "Tucson"],
    "Tata": ["Tiago", "Altroz", "Punch", "Nexon", "Harrier", "Safari", "Hexa"],
    "Honda": ["Amaze", "City", "Elevate"],
    "Kia": ["Sonet", "Carens", "Seltos", "Carnival"],
    "Toyota": ["Glanza", "Urban Cruiser Taisor", "Rumion", "Innova Crysta", "Innova Hycross", "Fortuner", "Hilux", "Camry"],
    "Volkswagen": ["Polo", "Virtus", "Taigun", "Tiguan"],
    "Skoda": ["Slavia", "Kushaq", "Kodiaq", "Superb"],
    "Renault": ["Kwid", "Triber", "Kiger"],
    "Nissan": ["Magnite"],
    "Mahindra": ["Thar", "XUV700", "Scorpio-N", "Scorpio Classic", "Bolero"],
    "MG": ["Hector", "Astor", "Gloster"],
    "Jeep": ["Compass", "Meridian", "Wrangler"],
    "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE"],
    "BMW": ["3 Series", "5 Series", "X1", "X3", "X5"],
    "Audi": ["A4", "A6", "Q3", "Q5", "Q7"],
    "Other": ["Other"]
  },
  "Van / Tractor / JCB / Generator": {
    "Mahindra": ["Arjun", "Yuvo", "Jivo", "Novo", "Supro", "Jeeto", "Powerol"],
    "John Deere": ["5E", "5M", "6M", "6R"],
    "Sonalika": ["Sikander", "Tiger", "Mahabali"],
    "New Holland": ["Excel", "Tx", "Simba"],
    "Massey Ferguson": ["Tafe", "Dynatrack"],
    "JCB": ["3DX", "4DX", "JS140", "JS205"],
    "Maruti Suzuki": ["Eeco", "Omni"],
    "Tata": ["Magic", "Winger"],
    "Force": ["Traveller", "Cruiser", "Toofan"],
    "Honda": ["Portable", "Inverter"],
    "Kirloskar": ["Green", "Chota Chilli"],
    "Cummins": ["Power", "QSK"],
    "Caterpillar": ["Diesel Genset", "Gas Genset"],
    "Other": ["Other"]
  },
  "Bus / Truck": {
    "Volvo": ["9700", "9900", "7900", "B11R", "FH16", "FH", "FM", "FMX"],
    "Scania": ["Touring", "Citywide", "Interlink", "R-Series", "G-Series", "P-Series", "V8"],
    "Tata": ["Starbus", "Marcopolo", "Magna", "Prima", "Signa", "Ultra", "LPT", "Ace"],
    "Ashok Leyland": ["Oyster", "Viking", "Falcon", "Boss", "Ecomet", "Captain", "Dost", "AVTR"],
    "Mercedes-Benz": ["Tourismo", "Citaro", "Actros", "Arocs", "Atego"],
    "BharatBenz": ["1015R", "1217C", "1923C", "2823C"],
    "Eicher": ["Pro 2000", "Pro 3000", "Pro 6000", "Pro 8000"],
    "Other": ["Other"]
  }
} as const;

export type VehicleType = keyof typeof vehicleData;
export type VehicleMake<T extends VehicleType> = keyof typeof vehicleData[T];

