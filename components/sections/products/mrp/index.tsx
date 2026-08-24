import MrpHero from "./MrpHero";
import MrpProblem from "./MrpProblem";
import MrpFeatures from "./MrpFeatures";
import MrpModules from "./MrpModules";
import MrpVoices from "./MrpVoices";
import MrpEarlyAccess from "./MrpEarlyAccess";

/**
 * The MRP Platform's own page body, rendered at /products/mrp in place of the
 * generic ProductDetail layout every other product uses.
 *
 * Order is the argument the page makes: here's the software (hero + mock),
 * here's the problem it solves, here's what actually works today, here's
 * honestly how far the rest has got, here's why it was built this way, now
 * come and try it. All copy lives in MRP_PAGE in lib/constants.ts.
 *
 * MrpEarlyAccess is the page's closing CTA and the last thing before the
 * footer - the route deliberately withholds the shared <CtaBand /> from
 * products that bring their own.
 */
export default function MrpPage() {
  return (
    <>
      <MrpHero />
      <MrpProblem />
      <MrpFeatures />
      <MrpModules />
      <MrpVoices />
      <MrpEarlyAccess />
    </>
  );
}
