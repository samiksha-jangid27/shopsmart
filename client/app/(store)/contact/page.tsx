import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="container-padded py-16">
      <h1 className="font-serif text-5xl">Contact</h1>
      <form className="mt-8 grid max-w-2xl gap-4">
        <Input placeholder="Name" />
        <Input type="email" placeholder="Email" />
        <Textarea placeholder="Message" />
        <Button type="button">Send enquiry</Button>
      </form>
    </div>
  );
}
