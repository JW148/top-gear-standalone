import ContactForm from "../Components/forms/contactForm";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col  items-center m-20">
      <h1 className="text-4xl font-light text-gray-700 mb-4">Contact</h1>
      <ContactForm />
      <h3 className="font-semibold text-gray-700 mt-8 text-pretty">
        Telephone us on:
      </h3>
      <h3 className=" text-gray-700 text-pretty">01501 763 800</h3>
      <h3 className="text-gray-700 text-pretty mt-8">
        Alternatively you may email us using the form above.
      </h3>
    </main>
  );
}
