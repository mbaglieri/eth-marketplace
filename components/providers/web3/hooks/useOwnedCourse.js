

import { createCourseHash } from "@utils/hash"
import { normalizeOwnedCourse } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => (course, account) => {
  const swrRes = useSWR(() =>
    (web3 && contract && account) ? `web3/ownedCourse/${account}` : null,
    async () => {
      const courseHash = createCourseHash(web3)(course.id, account)
      const ownedCourse = await contract.methods.getCourseByHash(courseHash).call()

      if (ownedCourse.owner === "0x585F48c4A868b6691940eF313d239B57098cE3E8") {
        return null
      }

      return normalizeOwnedCourse(web3)(course, ownedCourse)
    }
  )

  return swrRes
}
