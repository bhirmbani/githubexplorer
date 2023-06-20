import to from "await-to-js"
import { AxiosError, AxiosResponse } from "axios"

import apiInstance from "@/lib/axios"

type RepositoriesEdges = {
  node: {
    name: string
    description: string
    stargazerCount: number
    url: string
  }
}

export interface GetUserDataResponse {
  data: {
    search: {
      edges: {
        node: {
          login: string
          repositories: {
            edges: RepositoriesEdges[] | []
          }
        }
      }[]
    }
  }
}

export const getUserDataByUsername = async (
  url: string,
  { arg }: { arg: any }
) => {
  const api = apiInstance.post("https://api.github.com/graphql", {
    query: `{
        search (query: "${arg}", type: USER, last: 5){
          edges {
            node {
              ... on User {
                login
                repositories(last:99) {
                  edges {
                    node {
                      name
                      description
                      stargazerCount
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }`,
  })

  const [err, data] = await to<AxiosResponse<GetUserDataResponse>>(api)

  if (err) throw new Error(err.message)

  return data.data
}
