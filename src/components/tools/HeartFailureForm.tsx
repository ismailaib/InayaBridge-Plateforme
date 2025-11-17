import { Label } from '@/components/Label';

interface HeartFailureFormProps {
  formData: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function HeartFailureForm({ formData, onChange }: HeartFailureFormProps) {
  return (
    <div>
      <Label className="font-medium text-base">Patient Clinical Parameters</Label>
      <p className="mt-1 mb-6 text-sm text-gray-600 dark:text-gray-400">
        Enter comprehensive clinical data for cardiovascular risk assessment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-sm font-medium mb-2 block">Age (years)</Label>
          <input
            id="age"
            type="number"
            min="20"
            max="100"
            value={formData.age || ''}
            onChange={(e) => onChange('age', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter age"
          />
        </div>

        {/* Sex */}
        <div>
          <Label htmlFor="sex" className="text-sm font-medium mb-2 block">Sex</Label>
          <select
            id="sex"
            value={formData.sex || ''}
            onChange={(e) => onChange('sex', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select sex</option>
            <option value="M">Male (M)</option>
            <option value="F">Female (F)</option>
          </select>
        </div>

        {/* Chest Pain Type */}
        <div>
          <Label htmlFor="chestPain" className="text-sm font-medium mb-2 block">Chest Pain Type</Label>
          <select
            id="chestPain"
            value={formData.chestPain || ''}
            onChange={(e) => onChange('chestPain', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select type</option>
            <option value="TA">Typical Angina (TA)</option>
            <option value="ATA">Atypical Angina (ATA)</option>
            <option value="NAP">Non-Anginal Pain (NAP)</option>
            <option value="ASY">Asymptomatic (ASY)</option>
          </select>
        </div>

        {/* Resting BP */}
        <div>
          <Label htmlFor="restingBP" className="text-sm font-medium mb-2 block">Resting BP (mm Hg)</Label>
          <input
            id="restingBP"
            type="number"
            min="80"
            max="200"
            value={formData.restingBP || ''}
            onChange={(e) => onChange('restingBP', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="80-200"
          />
        </div>

        {/* Cholesterol */}
        <div>
          <Label htmlFor="cholesterol" className="text-sm font-medium mb-2 block">Cholesterol (mg/dl)</Label>
          <input
            id="cholesterol"
            type="number"
            min="100"
            max="400"
            value={formData.cholesterol || ''}
            onChange={(e) => onChange('cholesterol', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="100-400"
          />
        </div>

        {/* Fasting Blood Sugar */}
        <div>
          <Label htmlFor="fastingBS" className="text-sm font-medium mb-2 block">Fasting Blood Sugar (mg/dl)</Label>
          <input
            id="fastingBS"
            type="number"
            min="60"
            max="200"
            value={formData.fastingBS || ''}
            onChange={(e) => onChange('fastingBS', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="60-200"
          />
        </div>

        {/* Resting ECG */}
        <div>
          <Label htmlFor="restingECG" className="text-sm font-medium mb-2 block">Resting ECG</Label>
          <select
            id="restingECG"
            value={formData.restingECG || ''}
            onChange={(e) => onChange('restingECG', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select result</option>
            <option value="Normal">Normal</option>
            <option value="ST">ST-T wave abnormality (ST)</option>
            <option value="LVH">Left ventricular hypertrophy (LVH)</option>
          </select>
        </div>

        {/* Max HR */}
        <div>
          <Label htmlFor="maxHR" className="text-sm font-medium mb-2 block">Max Heart Rate</Label>
          <input
            id="maxHR"
            type="number"
            min="60"
            max="202"
            value={formData.maxHR || ''}
            onChange={(e) => onChange('maxHR', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="60-202"
          />
        </div>

        {/* Exercise Angina */}
        <div>
          <Label htmlFor="exerciseAngina" className="text-sm font-medium mb-2 block">Exercise Angina</Label>
          <select
            id="exerciseAngina"
            value={formData.exerciseAngina || ''}
            onChange={(e) => onChange('exerciseAngina', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select option</option>
            <option value="Y">Yes (Y)</option>
            <option value="N">No (N)</option>
          </select>
        </div>

        {/* Oldpeak */}
        <div>
          <Label htmlFor="oldpeak" className="text-sm font-medium mb-2 block">Oldpeak (ST Depression)</Label>
          <input
            id="oldpeak"
            type="number"
            min="0"
            max="6"
            step="0.1"
            value={formData.oldpeak || ''}
            onChange={(e) => onChange('oldpeak', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0-6"
          />
        </div>

        {/* ST Slope */}
        <div>
          <Label htmlFor="stSlope" className="text-sm font-medium mb-2 block">ST Slope</Label>
          <select
            id="stSlope"
            value={formData.stSlope || ''}
            onChange={(e) => onChange('stSlope', e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select slope</option>
            <option value="Up">Upsloping (Up)</option>
            <option value="Flat">Flat</option>
            <option value="Down">Downsloping (Down)</option>
          </select>
        </div>
      </div>
    </div>
  );
}