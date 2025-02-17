import { Activity, Heart, Ruler, Thermometer, Weight } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";

const formSchema = z.object({
  // Patient Information
  patientName: z.string(),
  gender: z.string(),
  race: z.string().optional(),
  address1: z.string(),
  address2: z.string(),
  address3: z.string(),
  patientId: z.string(),
  dateOfBirth: z.string(),
  ethnicity: z.string().optional(),
  phone: z.string(),

  // Responsible Party
  rpName: z.string(),
  rpAddress1: z.string(),
  rpAddress2: z.string(),
  rpAddress3: z.string(),
  rpPhone: z.string(),
  rpRelation: z.string(),

  // Primary Insurance
  primaryInsurerName: z.string(),
  primaryInsurerAddress: z.string().optional(),
  primaryGroupNumber: z.string().optional(),
  primaryPolicyNumber: z.string().optional(),
  primaryInsuredName: z.string(),
  primaryInsuredAddress1: z.string(),
  primaryInsuredAddress2: z.string(),
  primaryInsuredRelation: z.string(),

  // Secondary Insurance
  secondaryInsurerName: z.string(),
  secondaryInsurerAddress: z.string(),
  secondaryGroupNumber: z.string(),
  secondaryPolicyNumber: z.string(),
  secondaryInsuredName: z.string(),
  secondaryInsuredAddress: z.string(),
  secondaryInsuredRelation: z.string(),
});

export default function PatientDetails() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "Touden, Laios",
      gender: "M",
      address1: "20852 15TH RD",
      address2: "BAYSIDE",
      address3: "NY, 11360",
      patientId: "34304",
      dateOfBirth: "11-11-1970",
      phone: "(648) 695-5441",

      rpName: "Touden, Laios",
      rpAddress1: "20852 15TH RD",
      rpAddress2: "BAYSIDE",
      rpAddress3: "NY, 11360",
      rpPhone: "(648) 695-5441",
      rpRelation: "Self",

      primaryInsurerName: "Blue Cross Blue Shield - Personal Choice (PPO)",
      primaryInsuredName: "Touden, Laios",
      primaryInsuredAddress1: "20852 15TH RD",
      primaryInsuredAddress2: "BAYSIDE, NY, 11360",
      primaryInsuredRelation: "Self",

      secondaryInsurerName: "N/A",
      secondaryInsurerAddress: "N/A",
      secondaryGroupNumber: "N/A",
      secondaryPolicyNumber: "N/A",
      secondaryInsuredName: "N/A",
      secondaryInsuredAddress: "N/A",
      secondaryInsuredRelation: "N/A",
    },
  });

  return (
    <Form {...form}>
      <Card className="max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">PATIENT DETAILS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">PATIENT INFORMATION</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Patient Address</FormLabel>
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address3"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ethnicity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ethnicity</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Responsible Party Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Responsible Party / Guarantor Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="rpName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RP Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>RP Address</FormLabel>
                  <FormField
                    control={form.control}
                    name="rpAddress1"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rpAddress2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rpAddress3"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="rpPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RP Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rpRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RP Relation</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Insurance Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Primary Insurance */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Primary Insurance Information
              </h2>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="primaryInsurerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurer's Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryInsurerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurer's Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryGroupNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group #</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryPolicyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy #</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  Primary Policy Holder / Insured
                </h3>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="primaryInsuredName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryInsuredAddress1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryInsuredAddress2"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryInsuredRelation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Relation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Secondary Insurance */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Secondary Insurance Information
              </h2>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="secondaryInsurerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurer's Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryInsurerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurer's Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryGroupNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group #</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondaryPolicyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy #</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  Secondary Policy Holder / Insured
                </h3>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="secondaryInsuredName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryInsuredAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondaryInsuredRelation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insured Relation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Recent Vitals */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              PATIENT'S RECENT VITALS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Blood Pressure
                      </p>
                      <p className="text-xl font-semibold">120/80</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Heart Rate
                      </p>
                      <p className="text-xl font-semibold">72 bpm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="text-xl font-semibold">75 inches</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Temperature
                      </p>
                      <p className="text-xl font-semibold">98.6°F</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Weight className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-xl font-semibold">145 lbs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </Form>
  );
}
