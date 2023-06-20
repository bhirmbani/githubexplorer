"use client"

import Link from "next/link"
import { getUserDataByUsername } from "@/services/user"
import { Loader2, Star } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import useSWRMutation from "swr/mutation"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type FormValues = {
  username: string
}

export default function IndexPage() {
  const { trigger, data, isMutating } = useSWRMutation(
    "getUserData",
    getUserDataByUsername
  )

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
    },
  })

  const onClickSearch = async (data: FormValues) => {
    await trigger(data.username)
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="grid grid-cols-5">
        <div className="col-start-2 col-end-5">
          <form onSubmit={form.handleSubmit(onClickSearch)}>
            <Input
              placeholder="Username"
              disabled={isMutating}
              {...form.register("username", { required: true })}
            />
            <div className="mt-4">
              <Button disabled={isMutating} className="w-full">
                {isMutating ? (
                  <>
                    <Loader2 className="mr-1 animate-spin" size={12} />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>

          {form.formState.isSubmitSuccessful && (
            <div>
              <div className="mt-4">
                <p>{`Showing users for "${form.getValues("username")}"`}</p>
              </div>
              <div className="mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {data?.data.search.edges.map((each, index) =>
                    each.node?.login ? (
                      <AccordionItem value={`item-${index}`}>
                        <AccordionTrigger>{each.node?.login}</AccordionTrigger>
                        <AccordionContent>
                          {each.node?.repositories.edges.length > 0 ? (
                            each.node?.repositories.edges.map((each) => (
                              <Card className="">
                                <CardHeader>
                                  <div className="flex flex-row justify-between">
                                    <Link href={each.node.url}>
                                      <CardTitle className="cursor-pointer">
                                        {each.node.name}
                                      </CardTitle>
                                    </Link>
                                    <div className="flex items-center">
                                      <div className="mr-1">
                                        <p>{each.node.stargazerCount}</p>
                                      </div>
                                      <Star color="black" size={12} />
                                    </div>
                                  </div>
                                  <CardDescription>
                                    {each.node.description ?? "-"}
                                  </CardDescription>
                                </CardHeader>
                              </Card>
                            ))
                          ) : (
                            <p>This user dont have repository</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ) : null
                  )}
                </Accordion>
                {form.formState.isSubmitSuccessful &&
                  !data?.data.search.edges.some((each) => each.node.login) && (
                    <p>No username found</p>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
