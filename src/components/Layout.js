/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Footer from 'src/components/Footer';
import Header from 'src/components/headers/Header';
import HeaderConnected from 'src/components/headers/HeaderConnected';
import { UserContext } from 'src/components/store/UserProvider';
import { addPrefix } from 'src/utils';
import Script from 'next/script';

const Layout = ({
  children,
  title,
  metaTitle,
  metaImage,
  metaDescription,
  metaUrl,
  metaType,
  router,
  noIndex,
  isBackoffice,
}) => {
  const shouldShowAuthHeader =
    router.asPath.includes('/aider') &&
    router.asPath.includes('/travailler') &&
    router.asPath.includes('/recruter') &&
    router.asPath.includes('/candidats') &&
    router.asPath.includes('/partenaires') &&
    router.asPath.includes('/contact');

  const isPDF = router.asPath.includes('/pdf/');

  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          rel="icon"
          type="image/png"
          href={addPrefix('/static/img/fav.png')}
        />
        <link rel="canonical" href="https://www.linkedout.fr/" />
        {isPDF && (
          // eslint-disable-next-line @next/next/no-css-tags
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/dist/css/uikit.entourage.print.min.css"
            media="print"
          />
        )}
        {noIndex && <meta name="robots" content="noindex" />}
        <meta property="og:site_name" content="LinkedOut" />
        <meta property="og:description" content={metaDescription} />
        <meta name="description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta name="image" content={metaImage} />
        <meta property="og:type" content={metaType} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={metaUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:site" content="@R_Entourage" />
        <meta name="twitter:image" content={metaImage} />
        <meta name="fb:app_id" content={process.env.FB_APP_ID} />
        <meta
          name="facebook-domain-verification"
          content={process.env.FB_DOMAIN_VERIFICATION}
        />
      </Head>
      {!isPDF && !isBackoffice && (
        <UserContext.Consumer>
          {({ isAuthentificated }) => {
            return isAuthentificated && shouldShowAuthHeader ? (
              <HeaderConnected />
            ) : (
              router.asPath !== '/' && <Header isHome={false} />
            );
          }}
        </UserContext.Consumer>
      )}
      {children}
      {!isPDF && !isBackoffice && <Footer />}
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.GTM_TRACKING_ID}');
        `}
      </Script>
      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-analytics" strategy="afterInteractive">
        {`
          _linkedin_partner_id = "${process.env.LINKEDIN_PARTNER_ID}";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript";b.async = true;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);})(window.lintrk);
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${process.env.LINKEDIN_PARTNER_ID}&fmt=gif`}
        />
      </noscript>
      {/* Facebook Pixel */}
      <Script strategy="afterInteractive" id="facebook-analytics">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${process.env.FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${process.env.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {/* do not use the minified versions because of fix in full versions */}
      <Script
        strategy="beforeInteractive"
        src="/static/dist/js/uikit-fixed.js"
      />
      <Script
        strategy="beforeInteractive"
        src="/static/dist/js/uikit-icons.js"
      />
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_TRACKING_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaImage: PropTypes.string,
  metaDescription: PropTypes.string,
  metaUrl: PropTypes.string,
  metaType: PropTypes.string,
  router: PropTypes.shape({
    asPath: PropTypes.string,
  }).isRequired,
  noIndex: PropTypes.bool,
  isBackoffice: PropTypes.bool,
};

Layout.defaultProps = {
  title: 'LinkedOut\xa0: partagez votre réseau avec ceux qui n’en ont pas',
  metaTitle: 'LinkedOut\xa0: partagez votre réseau avec ceux qui n’en ont pas',
  metaImage: `${process.env.SERVER_URL}/static/img/linkedout-preview-new.jpg`,
  metaDescription:
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.",
  metaUrl: process.env.SERVER_URL,
  metaType: 'website',
  noIndex: false,
  isBackoffice: false,
};
export default withRouter(Layout);
