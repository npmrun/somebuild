import { watchEffect, type Ref } from 'vue'
// import {
//     type HeadConfig,
//     type SiteData,
//     createTitle,
//     // mergeHead
// } from '../../shared'

type HeadConfig = any
export function useUpdateHead(frontmatterHead: any) {
    let managedHeadTags: HTMLElement[] = []
    let isFirstUpdate = true

    const updateHeadTags = (newTags: HeadConfig[]) => {
        if (import.meta.env.PROD && isFirstUpdate) {
            // in production, the initial meta tags are already pre-rendered so we
            // skip the first update.
            isFirstUpdate = false
            return
        }

        managedHeadTags.forEach((el) => document.head.removeChild(el))
        managedHeadTags = []
        
        newTags.forEach((headConfig) => {
            const el = createHeadElement(["meta", headConfig, ""])
            document.head.appendChild(el)
            managedHeadTags.push(el)
        })
    }

    return updateHeadTags(filterOutHeadDescription(frontmatterHead))
}

function createHeadElement([tag, attrs, innerHTML]: HeadConfig) {
    const el = document.createElement(tag)
    for (const key in attrs) {
        el.setAttribute(key, attrs[key])
    }
    if (innerHTML) {
        el.innerHTML = innerHTML
    }
    return el
}

function isMetaDescription(headConfig: HeadConfig) {
    return (
        headConfig[0] === 'meta' &&
        headConfig[1] &&
        headConfig[1].name === 'description'
    )
}

function filterOutHeadDescription(head: HeadConfig[]) {
    return head.filter((h) => !isMetaDescription(h))
}