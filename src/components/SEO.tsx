import { Helmet } from "react-helmet-async";

const SITE_URL = "https://the-digital-desk.lovable.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  jsonLd?: Record<string, unknown>;
}

const SEO = ({ title, description, image, url, type = "website", jsonLd }: SEOProps) => {
  const fullUrl = url
    ? url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`
    : SITE_URL;
  const fullImage = image
    ? image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`
    : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
