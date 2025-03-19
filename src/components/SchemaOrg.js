'use client';

import { useEffect } from 'react';

/**
 * SchemaOrg Component for JSON-LD structured data
 * Adds structured data to improve search engine understanding
 * @param {Object} props - Schema.org structured data properties
 */
export default function SchemaOrg({ 
  organization = true, 
  website = true, 
  breadcrumbs = null,
  product = null,
  article = null,
  game = null,
  person = null,
  jobPosting = null,
  faqPage = null,
  customSchema = null
}) {
  useEffect(() => {
    // Remove any existing schema scripts to avoid duplicates
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
    
    const schemas = [];

    // Organization schema
    if (organization) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Grokade',
        url: 'https://grokade.com',
        logo: 'https://grokade.com/favicon.svg',
        sameAs: [
          'https://twitter.com/GrokadeGames',
          'https://github.com/grokade',
          'https://discord.gg/grokade'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'contact@grokade.com',
          contactType: 'customer service'
        }
      });
    }

    // Website schema
    if (website) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://grokade.com',
        name: 'Grokade - AI Gaming Vibe Hub',
        description: 'Discover games built with Grok and other AI tools. Play AI-generated games, browse our vibegame index, hire talent, and join competitions.',
        potentialAction: {
          '@type': 'SearchAction',
          'target': 'https://grokade.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      });
    }

    // Breadcrumbs schema
    if (breadcrumbs) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      });
    }

    // Game schema
    if (game) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: game.name,
        description: game.description,
        url: game.url,
        image: game.image,
        genre: game.genre,
        author: {
          '@type': 'Person',
          name: game.author
        },
        ...(game.aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: game.aggregateRating.ratingValue,
            ratingCount: game.aggregateRating.ratingCount,
            bestRating: game.aggregateRating.bestRating || 5,
            worstRating: game.aggregateRating.worstRating || 1
          }
        })
      });
    }

    // Product schema
    if (product) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        ...(product.aggregateRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.aggregateRating.ratingValue,
            ratingCount: product.aggregateRating.ratingCount
          }
        }),
        ...(product.offers && {
          offers: {
            '@type': 'Offer',
            price: product.offers.price,
            priceCurrency: product.offers.priceCurrency,
            availability: product.offers.availability
          }
        })
      });
    }

    // Job Posting schema
    if (jobPosting) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: jobPosting.title,
        description: jobPosting.description,
        datePosted: jobPosting.datePosted,
        validThrough: jobPosting.validThrough,
        employmentType: jobPosting.employmentType,
        hiringOrganization: {
          '@type': 'Organization',
          name: jobPosting.hiringOrganization.name,
          sameAs: jobPosting.hiringOrganization.sameAs
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: jobPosting.jobLocation.locality,
            addressRegion: jobPosting.jobLocation.region,
            addressCountry: jobPosting.jobLocation.country
          }
        },
        ...(jobPosting.baseSalary && {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: jobPosting.baseSalary.currency,
            value: {
              '@type': 'QuantitativeValue',
              value: jobPosting.baseSalary.value,
              unitText: jobPosting.baseSalary.unitText
            }
          }
        })
      });
    }

    // Article schema
    if (article) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.headline,
        image: article.image,
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
          '@type': 'Person',
          name: article.author.name
        }
      });
    }

    // FAQ Page schema
    if (faqPage) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqPage.questions.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
          }
        }))
      });
    }

    // Person schema
    if (person) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        ...(person.url && { url: person.url }),
        ...(person.image && { image: person.image }),
        ...(person.jobTitle && { jobTitle: person.jobTitle }),
        ...(person.worksFor && { 
          worksFor: {
            '@type': 'Organization',
            name: person.worksFor.name
          }
        })
      });
    }

    // Add any custom schema
    if (customSchema) {
      schemas.push(customSchema);
    }

    // Add all schemas to the page
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup on unmount
    return () => {
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => script.remove());
    };
  }, [organization, website, breadcrumbs, product, article, game, person, jobPosting, faqPage, customSchema]);

  return null;
} 