'use client'

import { useState } from 'react'
import { Card } from '@/components/Card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import Image from 'next/image'

interface DrawerItemProps {
  title: string
  children: React.ReactNode
}

const DrawerItem = ({ title, children }: DrawerItemProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Card className=" p-4 overflow-hidden hover:bg-gray-200 dark:hover:bg-gray-900 transition-all duration-300 cursor-pointer" onClick={() => setOpen(!open)}>
      <div
        className="w-full text-left px-4 py-2  flex justify-between items-center font-semibold  "
      >
        {title}
      </div>
      <div className={`transition-all duration-300 ${open ? 'max-h-[3000px] p-4' : 'max-h-0 p-0 overflow-hidden'}`}>
        {children}
      </div>
    </Card>
  )
}

export default function DiagnosticsReports() {
  return (
    <div className="my-8 space-y-4 print-section">

      <DrawerItem title="Ophthalmology AI">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Comprehensive eye disease detection
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input Image</p>
              <Image src="/images/ophthalmology-input.jpg" alt="Ophthalmology Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Output Result</p>
              <Image src="/images/ophthalmology-output.jpg" alt="Ophthalmology Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="Glaucoma Detection">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Automated glaucoma screening
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input Image</p>
              <Image src="/images/glaucoma-input.jpg" alt="Glaucoma Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Output Result</p>
              <Image src="/images/glaucoma-output.jpg" alt="Glaucoma Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="Dermatology AI">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Real-time skin disease analysis
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input Image</p>
              <Image src="/images/dermatology-input.jpg" alt="Dermatology Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Output Result</p>
              <Image src="/images/dermatology-output.jpg" alt="Dermatology Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="Heart Failure Prediction">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Cardiovascular risk assessment
          </p>
          <div>
            <div className="overflow-auto">
              <TableRoot>
                <Table>
                  <TableCaption>Patient clinical features</TableCaption>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Feature</TableHeaderCell>
                      <TableHeaderCell>Value</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow><TableCell>Chest Pain Type</TableCell><TableCell>Typical Angina</TableCell></TableRow>
                    <TableRow><TableCell>Resting BP</TableCell><TableCell>140 mm Hg</TableCell></TableRow>
                    <TableRow><TableCell>Cholesterol</TableCell><TableCell>230 mg/dl</TableCell></TableRow>
                    <TableRow><TableCell>Fasting Blood Sugar</TableCell><TableCell>120 mg/dl</TableCell></TableRow>
                    <TableRow><TableCell>Resting ECG</TableCell><TableCell>Normal</TableCell></TableRow>
                    <TableRow><TableCell>Max Heart Rate</TableCell><TableCell>160</TableCell></TableRow>
                    <TableRow><TableCell>Exercise Angina</TableCell><TableCell>No</TableCell></TableRow>
                    <TableRow><TableCell>Oldpeak</TableCell><TableCell>1.2</TableCell></TableRow>
                    <TableRow><TableCell>ST Slope</TableCell><TableCell>Upsloping</TableCell></TableRow>
                  </TableBody>
                  <TableFoot>
                    <TableRow>
                      <TableHeaderCell colSpan={2} className="text-right">
                        Prediction: <span className="text-red-600 font-semibold">High Risk</span>
                      </TableHeaderCell>
                    </TableRow>
                  </TableFoot>
                </Table>
              </TableRoot>
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="FLAMeS MS Segmentation">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input MRI</p>
              <Image src="/images/flames-input.jpg" alt="FLAMeS Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Segmented Result</p>
              <Image src="/images/flames-output.jpg" alt="FLAMeS Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="Chest X-ray HybridGNet">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input X-ray</p>
              <Image src="/images/chest-xray-input.jpg" alt="Chest X-ray Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Detected Pathology</p>
              <Image src="/images/chest-xray-output.jpg" alt="Chest X-ray Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

      <DrawerItem title="Brain Tumor Analysis">
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1 font-medium">Input Scan</p>
              <Image src="/images/brain-tumor-input.jpg" alt="Brain Tumor Input" width={100} height={100} className="w-full border rounded" />
            </div>
            <div>
              <p className="text-sm mb-1 font-medium">Detected Tumor</p>
              <Image src="/images/brain-tumor-output.jpg" alt="Brain Tumor Output" width={100} height={100} className="w-full border rounded" />
            </div>
          </div>
        </Card>
      </DrawerItem>

    </div>
  )
}
