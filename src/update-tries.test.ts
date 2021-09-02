import nock from "nock";
import { PUBLIC_SUFFIX_URL } from "./config";
import { fetchBuildSerializeTries } from "./update-tries";
import { readPslFixture } from "./tests/fixtures/fixtures";

describe(fetchBuildSerializeTries.name, () => {
  const publicSuffixUrl = new URL(PUBLIC_SUFFIX_URL);
  let pslFixture: string;

  beforeAll(async () => {
    pslFixture = await readPslFixture();
  });

  test("fetches the public suffix and builds tries plus meta information", async () => {
    nock(publicSuffixUrl.origin)
      .get(publicSuffixUrl.pathname)
      .reply(200, pslFixture);

    const { serializedIcannTrie, serializedPrivateTrie } =
      await fetchBuildSerializeTries();

    expect(serializedIcannTrie).toMatchSnapshot();
    expect(serializedPrivateTrie).toMatchSnapshot();
  });
});
