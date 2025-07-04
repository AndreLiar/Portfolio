import { ContactForm } from "./contact-form";

export function Contact({ contactFormData }: { contactFormData: any }) {
  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm contactFormData={contactFormData} />
    </div>
  );
}
