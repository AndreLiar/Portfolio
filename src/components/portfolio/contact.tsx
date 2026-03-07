import { ContactForm } from "./contact-form";

export function Contact({ contactFormData, contactEmail }: { contactFormData: any; contactEmail?: string }) {
  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm contactFormData={contactFormData} contactEmail={contactEmail} />
    </div>
  );
}
