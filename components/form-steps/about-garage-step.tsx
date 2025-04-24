"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const AboutGarageStep = forwardRef((props, ref) => {
  const formRef = useRef(null)
  
  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (formRef.current) {
        const formData = new FormData(formRef.current)
        return Object.fromEntries(formData.entries())
      }
      return {}
    }
  }))

  return (
    <form id="aboutGarage" ref={formRef}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established</Label>
            <Input id="yearEstablished" name="yearEstablished" placeholder="" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundedBy">Founded By</Label>
            <Input id="foundedBy" name="foundedBy" placeholder="" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inspiration">Inspiration / Reason</Label>
          <Textarea 
            id="inspiration" 
            name="inspiration" 
            placeholder="What inspired you to start this garage?" 
            className="min-h-[100px]" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthJourney">Growth Journey</Label>
          <Textarea
            id="growthJourney"
            name="growthJourney"
            placeholder="Tell us about your garage's growth journey"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="challengesFaced">Challenges Faced</Label>
          <Textarea
            id="challengesFaced"
            name="challengesFaced"
            placeholder="What challenges did you face and how did you overcome them?"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="milestones">Milestones</Label>
          <Textarea
            id="milestones"
            name="milestones"
            placeholder="Share your major achievements and milestones"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visionValues">Vision & Values</Label>
          <Textarea
            id="visionValues"
            name="visionValues"
            placeholder="What are your garage's vision and core values?"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </form>
  )
})

AboutGarageStep.displayName = "AboutGarageStep"
export default AboutGarageStep