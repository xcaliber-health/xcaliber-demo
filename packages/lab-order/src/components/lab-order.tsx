import { Badge, Calendar, Paperclip, Plus, Printer } from "lucide-react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";


export default function LabOrder() {
  return (
    <div className="">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-2xl font-bold">LAB ORDER DETAILS</h1>
          <Badge className="bg-[#40E0D0] hover:bg-[#40E0D0] text-black">
            COMPLETE
          </Badge>
        </div>

        <div className="grid gap-6 mb-6">
          <div className="grid gap-2">
            <Label>Collection Date:</Label>
            <Input type="date" />
          </div>
          <div className="grid gap-2">
            <Label>Collection Time:</Label>
            <Input type="time" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <section>
            <h2 className="text-lg font-semibold mb-4">PROVIDER INFORMATION</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Approving Provider:</Label>
                <Input defaultValue="Ach, Chip" />
              </div>
              <div className="grid gap-2">
                <Label>NPI:</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Ordering Provider:</Label>
                <Input defaultValue="Ach, Chip" />
              </div>
              <div className="grid gap-2">
                <Label>NPI:</Label>
                <Input />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">
              Client / Ordering Site Information
            </h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Account Name:</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Address:</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label>Phone:</Label>
                <Input />
              </div>
            </div>
          </section>
        </div>

        <div className="border rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            ORDER: CBC with differential/platelet
          </h2>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Send</Label>
                <div className="flex gap-2">
                  <Input type="date" defaultValue="2025-02-12" />
                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Checkbox id="stat" />
                <Label htmlFor="stat">STAT</Label>
                <Checkbox id="standing" />
                <Label htmlFor="standing">Standing order</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Alarm</Label>
              <div className="flex gap-2">
                <Select defaultValue="1week">
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1 week</SelectItem>
                    <SelectItem value="2weeks">2 weeks</SelectItem>
                    <SelectItem value="1month">1 month</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" defaultValue="2025-02-19" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Send to</Label>
              <div className="border rounded p-3">
                <div className="font-medium">Labcorp</div>
                <div className="text-sm text-muted-foreground">
                  1000 Northern Blvd, Great Neck, NY 11021
                </div>
                <div className="text-sm text-muted-foreground">
                  Ph: (516) 504-0509, Fax (516) 504-0924
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>CC results</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> RECIPIENT
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Attachments</Label>
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-1" /> ATTACHMENTS
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="publish" />
                <Label htmlFor="publish">
                  Do not immediately publish results upon receipt
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note to lab</Label>
              <Textarea />
            </div>

            <div className="space-y-2">
              <Label>Internal note</Label>
              <Textarea />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Specimen Collection</Label>
                <div className="flex gap-2">
                  <Button variant="secondary">External Lab</Button>
                  <Button variant="outline">Office</Button>
                  <Button variant="outline">Home</Button>
                  <Button variant="outline">Add-On</Button>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Billing type</Label>
                <div className="flex gap-2">
                  <Button variant="secondary">Patient</Button>
                  <Button variant="outline">Practice</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            PRINT
          </Button>
          <Button variant="outline">VIEW DOCUMENT</Button>
        </div>
      </Card>
    </div>
  );
}
