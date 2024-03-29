

import { createCourseHash } from "@utils/hash"
import { normalizeOwnedCourse } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => (courses, account) => {
  const swrRes = useSWR(() =>
    (web3 &&
     contract &&
     account) ? `web3/ownedCourses/${account}` : null,
    async () => {
      const ownedCourses = []
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i]

        if (!course.id) { continue }

        const courseHash = createCourseHash(web3)(course.id, account)
        const ownedCourse = await contract.methods.getCourseByHash(courseHash).call()

        if (ownedCourse.owner !== "0x585F48c4A868b6691940eF313d239B57098cE3E8") {
          const normalized = normalizeOwnedCourse(web3)(course, ownedCourse)
          ownedCourses.push(normalized)
        }
      }

      return ownedCourses
    }
  )

  return {
    ...swrRes,
    lookup: swrRes.data?.reduce((a, c) => {
      a[c.id] = c
      return a
    }, {}) ?? {}
  }
}
