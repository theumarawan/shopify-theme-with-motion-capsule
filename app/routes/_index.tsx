import {data, useLoaderData} from 'react-router';
import {VelnauraHomepage, type StorefrontProduct} from '~/components/VelnauraHomepage';
import type {Route} from './+types/_index';

const FALLBACK_PRODUCT: StorefrontProduct = {
  id: 'demo-mugtea', title: 'Mugtea Whipped Cleanser', handle: 'mugtea',
  description: 'A pore-calming, deep-cleansing and barrier-respecting daily ritual.',
  image: {url: '/mugtea-cleanser.png', altText: 'Velnaura Mugtea Whipped Facial Cleanser tube'},
  variant: {id: 'demo-variant', availableForSale: true, price: {amount: '2395.00', currencyCode: 'PKR'}},
};

const PRODUCT_QUERY = `#graphql
  query FeaturedProduct($handle: String!) {
    product(handle: $handle) {
      id title handle description
      featuredImage { url altText }
      selectedOrFirstAvailableVariant { id availableForSale price { amount currencyCode } }
    }
  }
` as const;

export const meta: Route.MetaFunction = () => [
  {title: 'Velnaura | Skin Beyond Genetics'},
  {name: 'description', content: 'Evidence-led skincare for those who push beyond what genetics alone offers.'},
];

export async function loader({context}: Route.LoaderArgs) {
  if (!context.env.PUBLIC_STORE_DOMAIN || !context.env.PUBLIC_STOREFRONT_API_TOKEN) return data({product: FALLBACK_PRODUCT, mode: 'demo' as const});
  try {
    const result = await context.storefront.query(PRODUCT_QUERY, {variables: {handle: context.env.FEATURED_PRODUCT_HANDLE || 'mugtea'}});
    const item = result.product;
    if (!item?.featuredImage || !item.selectedOrFirstAvailableVariant) throw new Error('Incomplete product');
    return data({product: {...item, image: item.featuredImage, variant: item.selectedOrFirstAvailableVariant} as StorefrontProduct, mode: 'shopify' as const});
  } catch {
    return data({product: FALLBACK_PRODUCT, mode: 'demo' as const});
  }
}

export default function Homepage() {
  const {product, mode} = useLoaderData<typeof loader>();
  return <VelnauraHomepage product={product} mode={mode}/>;
}
