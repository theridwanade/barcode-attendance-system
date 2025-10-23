interface RouteParams {
    params: {
        slug: string;
    };
}

const Page = async ({ params }: RouteParams) => {
    const { slug } = await params;
  return (
    <div>Page: {slug}</div>
  )
}
export default Page;