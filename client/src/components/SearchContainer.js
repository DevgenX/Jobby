import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "./context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
    statusOptions,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;

    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleClearFilter = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>Search Jobs</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="Type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={["all", ...sortOptions]}
          />
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default SearchContainer;
