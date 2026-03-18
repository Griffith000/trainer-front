import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using AI Coach, you accept and agree to be bound
              by the terms and conditions of this agreement. If you do not agree
              to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              AI Coach provides an AI-powered personal coaching platform. You
              agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>
                Not use the service for any illegal or unauthorized purpose
              </li>
              <li>Not interfere with or disrupt the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account and password. You agree to accept responsibility for all
              activities that occur under your account. We reserve the right to
              terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              AI Coach is not a substitute for professional medical advice,
              diagnosis, or treatment. Always seek the advice of your physician
              or other qualified health provider with any questions you may have
              regarding a medical condition. Never disregard professional
              medical advice or delay seeking it because of something you have
              read on AI Coach.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The service and its original content, features, and functionality
              are owned by AI Coach and are protected by international
              copyright, trademark, patent, trade secret, and other intellectual
              property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain all rights to any content you submit, post, or display
              on or through the service. By submitting content, you grant us a
              worldwide, non-exclusive, royalty-free license to use, reproduce,
              and process your content solely for the purpose of providing and
              improving our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, AI Coach shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses resulting from your use of
              the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days notice
              prior to any new terms taking effect. What constitutes a material
              change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed and construed in accordance with the
              laws of your jurisdiction, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at
              legal@trainerai.example.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
