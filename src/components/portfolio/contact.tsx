import { ContactForm } from "./contact-form";

interface ContactProps {
  contactFormData: any;
}

export function Contact({ contactFormData }: ContactProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm contactFormData={contactFormData} />
    </div>
  );
}
