/**
 * Renders a schema.org graph as a JSON-LD script tag.
 *
 * Server-rendered on purpose - the markup has to be in the HTML Google
 * receives, not injected after hydration.
 *
 * `<` is escaped because a JSON string containing "</script>" would otherwise
 * close this tag early and spill the rest of the payload into the document as
 * markup. None of the current content contains one, but the copy in
 * lib/constants.ts is edited freely and shouldn't be able to break the page.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
