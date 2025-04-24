"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface AvailableBrandsStepProps {
  fluids: { id: number }[]
  setFluids: React.Dispatch<React.SetStateAction<{ id: number }[]>>
}

const AvailableBrandsStep = forwardRef<any, AvailableBrandsStepProps>(({ fluids, setFluids }, ref) => {
  const formRef = useRef(null)
  
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        
        // Group data by fluid ID
        const fluidData: { [key: string]: { [key: string]: FormDataEntryValue } } = {}
        for (let [key, value] of formData.entries()) {
          const match = key.match(/fluid-(\d+)-(.+)/)
          if (match) {
            const [, fluidId, fieldName] = match
            if (!fluidData[fluidId]) {
              fluidData[fluidId] = {}
            }
            fluidData[fluidId][fieldName] = value
          }
        }
        
        return { fluids: Object.values(fluidData) }
      }
      return { fluids: [] }
    }
  }))

  const addFluid = () => {
    const newId = fluids.length > 0 ? Math.max(...fluids.map((f) => f.id)) + 1 : 1
    setFluids([...fluids, { id: newId }])
  }

  const removeFluid = (id: number) => {
    setFluids(fluids.filter((fluid) => fluid.id !== id))
  }

  return (
    <form id="availableBrands" ref={formRef}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-primary">Available Fluids</h3>
          <Button
            type="button"
            onClick={addFluid}
            variant="outline"
            className="flex items-center border-primary text-primary"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Fluid
          </Button>
        </div>

        {fluids.map((fluid, index) => (
          <div key={fluid.id} className="border rounded-lg p-6 relative hover:border-primary transition-colors">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => removeFluid(fluid.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <h4 className="font-semibold text-lg py-2 border-b border-gray-200 mb-4">Fluid {index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`fluidType-${fluid.id}`}>Fluid Type</Label>
                <Select name={`fluid-${fluid.id}-fluidType`}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Fluid Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engine-oil">Engine Oil</SelectItem>
                    <SelectItem value="brake-fluid">Brake Fluid</SelectItem>
                    <SelectItem value="coolant">Coolant</SelectItem>
                    <SelectItem value="transmission-fluid">Transmission Fluid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`brandName-${fluid.id}`}>Brand Name</Label>
                <Input id={`brandName-${fluid.id}`} name={`fluid-${fluid.id}-brandName`} placeholder="e.g. Castrol, Shell" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`grade-${fluid.id}`}>Grade (if applicable)</Label>
                <Input id={`grade-${fluid.id}`} name={`fluid-${fluid.id}-grade`} placeholder="e.g. 5W-30, 10W-40" />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`rate-${fluid.id}`}>Rate/L</Label>
                <Input id={`rate-${fluid.id}`} name={`fluid-${fluid.id}-rate`} placeholder="Price per liter" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`usedFor-${fluid.id}`}>Used For (Vehicle Types)</Label>
              <Input id={`usedFor-${fluid.id}`} name={`fluid-${fluid.id}-usedFor`} placeholder="e.g. All Petrol Cars, Diesel SUVs" />
            </div>
          </div>
        ))}
      </div>
    </form>
  )
})

AvailableBrandsStep.displayName = "AvailableBrandsStep"
export default AvailableBrandsStep