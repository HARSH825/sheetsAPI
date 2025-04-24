"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface StaffDetailsStepProps {
  staffMembers: { id: number }[]
  setStaffMembers: React.Dispatch<React.SetStateAction<{ id: number }[]>>
}

const StaffDetailsStep = forwardRef<any, StaffDetailsStepProps>(({ staffMembers, setStaffMembers }, ref) => {
  const formRef = useRef(null)
  
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        
        // Group data by staff member ID
        const staffData: { [key: string]: { [key: string]: FormDataEntryValue } } = {}
        for (let [key, value] of formData.entries()) {
          const match = key.match(/staff-(\d+)-(.+)/)
          if (match) {
            const [, staffId, fieldName] = match
            if (!staffData[staffId]) {
              staffData[staffId] = {}
            }
            staffData[staffId][fieldName] = value
          }
        }
        
        return { staffMembers: Object.values(staffData) }
      }
      return { staffMembers: [] }
    }
  }))

  const addStaffMember = () => {
    const newId = staffMembers.length > 0 ? Math.max(...staffMembers.map((s) => s.id)) + 1 : 1
    setStaffMembers([...staffMembers, { id: newId }])
  }

  const removeStaffMember = (id: number) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== id))
  }

  return (
    <form id="staffDetails" ref={formRef}>
      <div className="space-y-6">
        {staffMembers.map((staff, index) => (
          <div key={staff.id} className="border rounded-lg p-6 relative hover:border-primary transition-colors">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => removeStaffMember(staff.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <h4 className="font-semibold text-lg py-2 border-b border-gray-200 mb-4">Staff Member {index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`staffName-${staff.id}`}>Name</Label>
                <Input 
                  id={`staffName-${staff.id}`} 
                  name={`staff-${staff.id}-name`} 
                  placeholder="" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`staffPhone-${staff.id}`}>Phone Number</Label>
                <Input 
                  id={`staffPhone-${staff.id}`} 
                  name={`staff-${staff.id}-phone`} 
                  placeholder="" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`specialist-${staff.id}`}>Specialist</Label>
                <Select name={`staff-${staff.id}-specialist`}>
                  <SelectTrigger id={`specialist-${staff.id}`}>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="painter">Painter</SelectItem>
                    <SelectItem value="ac-specialist">AC Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`photoLink-${staff.id}`}>Photo Link</Label>
                <Input 
                  id={`photoLink-${staff.id}`} 
                  name={`staff-${staff.id}-photoLink`} 
                  placeholder="" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`notes-${staff.id}`}>Notes</Label>
              <Textarea 
                id={`notes-${staff.id}`} 
                name={`staff-${staff.id}-notes`} 
                placeholder="" 
                className="min-h-[100px]" 
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={addStaffMember}
          className="w-full flex items-center justify-center brand-gradient text-white brand-shadow"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
      </div>
    </form>
  )
})

StaffDetailsStep.displayName = "StaffDetailsStep"
export default StaffDetailsStep