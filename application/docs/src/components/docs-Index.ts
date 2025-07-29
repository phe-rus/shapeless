'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DOCS_CONFIG } from '@/lib/config';

export default function DocsIndex() {
    const router = useRouter();

    useEffect(() => {
        // 1. first category by order
        const firstCat = Object.entries(DOCS_CONFIG.categories)
            .sort(([, cfgA], [, cfgB]) => (cfgA.order ?? Infinity) - (cfgB.order ?? Infinity))[0]?.[0];

        if (!firstCat) return;

        // 2. first doc slug in that category
        const firstSlug = DOCS_CONFIG.categories[firstCat as keyof typeof DOCS_CONFIG.categories]!.items[0];
        if (!firstSlug) return;

        router.replace(`/docs/${firstCat}/${firstSlug}`);
    }, [router]);

    // blank while redirecting
    return null;
}