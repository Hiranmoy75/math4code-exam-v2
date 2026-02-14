import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = 'https://www.math4code.com'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/courses`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/test-series`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // Fetch published courses
    const { data: courses } = await supabase
        .from('courses')
        .select('id, updated_at')
        .eq('is_published', true)
        .eq('course_type', 'course')
        .order('updated_at', { ascending: false })

    const coursePages: MetadataRoute.Sitemap = courses?.map((course) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: new Date(course.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    })) || []

    // Fetch published test series
    const { data: testSeries } = await supabase
        .from('courses')
        .select('id, updated_at')
        .eq('is_published', true)
        .eq('course_type', 'test_series')
        .order('updated_at', { ascending: false })

    const testSeriesPages: MetadataRoute.Sitemap = testSeries?.map((series) => ({
        url: `${baseUrl}/test-series/${series.id}`,
        lastModified: new Date(series.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
    })) || []

    return [...staticPages, ...coursePages, ...testSeriesPages]
}
