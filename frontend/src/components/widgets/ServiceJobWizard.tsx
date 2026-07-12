import { useState } from 'react';
import { Car, FileCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { vehicleData, type VehicleType } from '../../data/vehicles';

const PRICING: Record<VehicleType, number> = {
  "Two Wheeler": 799,
  "Three Wheeler": 999,
  "Car": 1999,
  "Van / Tractor / JCB / Generator": 2999,
  "Bus / Truck": 4999
};

export default function ServiceJobWizard({ onJobLogged }: { onJobLogged: () => void }) {
  const [step, setStep] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Car');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [vehicleNumberPlate, setVehicleNumberPlate] = useState('');
  const [engineType, setEngineType] = useState('Petrol');
  const [mileage, setMileage] = useState('');
  const [review, setReview] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => setStep((s) => Math.min(s + 1, 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerLocation,
          vehicleType,
          vehicleMake: vehicleMake === 'Other' ? customMake : vehicleMake,
          vehicleModel: vehicleModel === 'Other' ? customModel : vehicleModel,
          vehicleNumberPlate,
          engineType,
          mileage: Number(mileage),
          review,
          revenue: PRICING[vehicleType]
        })
      });
      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch (e) {}
        throw new Error(errData?.error || `Server returned ${response.status}`);
      }
      setSuccess(true);
      onJobLogged();
      setTimeout(() => {
        setSuccess(false);
        setStep(0);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerLocation('');
        setVehicleType('Car');
        setVehicleMake('');
        setVehicleModel('');
        setCustomMake('');
        setCustomModel('');
        setVehicleNumberPlate('');
        setEngineType('Petrol');
        setMileage('');
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'Failed to submit job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">New Service Job</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Log a completed engine carbon service</p>
        </div>
        
        <div className="flex items-center gap-2">
          {[0, 1].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-brand-default' : i < step ? 'bg-brand-light dark:bg-brand-default/30' : 'bg-slate-100 dark:bg-slate-800'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className={step === 0 ? 'block animate-in fade-in slide-in-from-left-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-brand-default" />
            Customer & Vehicle Details
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +1234567890" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Vehicle Type</label>
              <select 
                value={vehicleType}
                onChange={(e) => {
                  const newType = e.target.value as VehicleType;
                  setVehicleType(newType);
                  setEngineType(
                    newType.includes('Two Wheeler') ? '' : 
                    newType === 'Bus / Truck' || newType === 'Van / Tractor / JCB / Generator' ? 'Diesel' : 'Petrol'
                  );
                  setVehicleMake('');
                  setVehicleModel('');
                  setCustomMake('');
                  setCustomModel('');
                }}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
              >
                {Object.keys(vehicleData).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4 flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Service Price</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-500">₹{PRICING[vehicleType].toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Make</label>
                <select 
                  value={vehicleMake}
                  onChange={(e) => {
                    setVehicleMake(e.target.value);
                    setVehicleModel(''); // Reset model when make changes
                    setCustomMake('');
                    setCustomModel('');
                  }}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                >
                  <option value="">Select Make</option>
                  {Object.keys(vehicleData[vehicleType]).map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                {vehicleMake === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom make..."
                    value={customMake}
                    onChange={(e) => setCustomMake(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Model</label>
                <select 
                  value={vehicleModel}
                  onChange={(e) => {
                    setVehicleModel(e.target.value);
                    if (e.target.value !== 'Other') setCustomModel('');
                  }}
                  disabled={!vehicleMake}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all disabled:opacity-50"
                >
                  <option value="">Select Model</option>
                  {vehicleMake && vehicleMake !== 'Other' && (vehicleData[vehicleType] as any)[vehicleMake]?.map((model: string) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  {vehicleMake === 'Other' && <option value="Other">Other</option>}
                  {vehicleMake && vehicleMake !== 'Other' && !((vehicleData[vehicleType] as any)[vehicleMake]?.includes('Other')) && (
                    <option value="Other">Other</option>
                  )}
                </select>
                {vehicleModel === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom model..."
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                  />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Number Plate</label>
              <input 
                type="text" 
                placeholder="e.g. AP 04 CX 1234" 
                value={vehicleNumberPlate}
                onChange={(e) => setVehicleNumberPlate(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all uppercase"
              />
            </div>

            <div className={`grid grid-cols-1 gap-4 ${vehicleType === 'Two Wheeler' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Location</label>
                <select 
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                >
                  <option value="">Select Location</option>
                  <option value="Kadapa">Kadapa</option>
                  <option value="Tirupati">Tirupati</option>
                </select>
              </div>
              {vehicleType !== 'Two Wheeler' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Engine Type</label>
                  <select 
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                  >
                    {vehicleType === 'Bus / Truck' || vehicleType === 'Van / Tractor / JCB / Generator' ? (
                      <>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                      </>
                    ) : (
                      <>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                      </>
                    )}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mileage</label>
                <input 
                  type="number" 
                  placeholder="e.g. 120000" 
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Review (Optional)</label>
                <textarea 
                  placeholder="e.g. Engine runs much smoother now!" 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-default/20 focus:border-brand-default transition-all resize-y min-h-[100px]"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm">
            {errorMsg}
          </div>
        )}

        <div className={step === 1 ? 'flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-4 duration-300 min-h-[300px]' : 'hidden'}>
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-light/30 dark:bg-brand-default/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-brand-default" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Job Logged!</h3>
              <p className="text-slate-500 dark:text-slate-400">The customer has been notified via WhatsApp.</p>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center justify-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-default" />
                Confirm Job Details
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8 border border-slate-100 dark:border-slate-700">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Vehicle:</span>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {vehicleMake === 'Other' ? customMake : vehicleMake} {vehicleModel === 'Other' ? customModel : vehicleModel}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Number Plate:</span>
                    <span className="font-medium text-slate-800 dark:text-white">{vehicleNumberPlate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Mileage:</span>
                    <span className="font-medium text-slate-800 dark:text-white">{mileage}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 z-10">
        <button 
          onClick={handlePrev}
          className={`px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 transition-opacity ${step === 0 || success ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Back
        </button>
        
        {step < 1 ? (
          <button 
            onClick={handleNext}
            disabled={
              (step === 0 && (!customerName || !customerPhone || !customerLocation || !vehicleMake || !vehicleModel || !vehicleNumberPlate || !mileage || 
                (vehicleMake === 'Other' && !customMake) || 
                (vehicleModel === 'Other' && !customModel)))
            }
            className="bg-brand-default hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          !success && (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-brand-default hover:bg-brand-dark text-white px-8 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-brand-default/20"
            >
              {loading ? 'Processing...' : 'Confirm & Notify'}
              {!loading && <CheckCircle2 className="w-4 h-4" />}
            </button>
          )
        )}
      </div>
    </div>
  );
}
