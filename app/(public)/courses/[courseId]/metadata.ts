import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
    const { courseId } = await params
    const supabase = await createClient()

    const { data: course } = await supabase
        .from('courses')
        .select('title, description, category, price, thumbnail_url, profiles:creator_id(full_name)')
        .eq('id', courseId)
        .single()

    if (!course) {
        return {
            title: 'Course Not Found',
        }
    }

    const instructorName = (course.profiles as any)?.full_name || 'Expert Instructor'
    const courseType = course.category || 'Course'
    const description = course.description?.substring(0, 155) || `Learn ${course.title} with expert guidance`

    // Generate keywords from course data
    const keywords = [
        course.title,
        courseType,
        'online course',
        'video lectures',
        instructorName,
        'competitive exam preparation',
        'mathematics course'
    ]

    return {
        title: `${course.title} - Online Course`,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title: `${course.title} | Math4Code`,
            description,
            type: 'website',
            url: `https://www.math4code.com/courses/${courseId}`,
            images: course.thumbnail_url ? [
                {
                    url: course.thumbnail_url,
                    width: 1200,
                    height: 630,
                    alt: course.title,
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: course.title,
            description,
            images: course.thumbnail_url ? [course.thumbnail_url] : [],
        },
    }
}
