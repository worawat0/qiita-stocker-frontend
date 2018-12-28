import { shallowMount, mount, createLocalVue, config } from "@vue/test-utils";
import Vuex from "vuex";
import {
  IUpdateCategoryPayload,
  ICategorizePayload,
  QiitaModule
} from "@/store/modules/qiita";
import Stocks from "@/pages/Stocks.vue";
import SideMenu from "@/components/SideMenu.vue";
import StockEdit from "@/components/StockEdit.vue";
import StockList from "@/components/StockList.vue";
import CategoryList from "@/components/CategoryList.vue";
import Pagination from "@/components/Pagination.vue";
import { IQiitaState } from "@/types/qiita";
import VueRouter from "vue-router";
import { IPage, IUncategorizedStock } from "@/domain/qiita";

config.logModifiedComponents = false;

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe("Stocks.vue", () => {
  let store: any;
  let state: IQiitaState;
  let actions: any;

  beforeAll(() => {
    state = {
      authorizationCode: "",
      accessToken: "",
      qiitaAccountId: "",
      permanentId: "",
      sessionId: "d690e4de-0a4e-4f14-a5c5-f4303fbd8a08",
      categories: [],
      stocks: [],
      currentPage: 1,
      paging: [],
      isCategorizing: false,
      isLoading: false
    };

    actions = {
      saveCategory: jest.fn(),
      updateCategory: jest.fn(),
      fetchCategory: jest.fn(),
      fetchStock: jest.fn(),
      setIsCategorizing: jest.fn(),
      categorize: jest.fn(),
      checkStock: jest.fn()
    };

    store = new Vuex.Store({
      modules: {
        QiitaModule: {
          namespaced: true,
          state,
          actions,
          getters: QiitaModule.getters
        }
      }
    });
  });

  describe("methods", () => {
    it('calls store action "saveCategory" on onClickSaveCategory()', () => {
      const wrapper = shallowMount(Stocks, { store, localVue, router });
      const inputtedCategory = "inputtedCategory";

      // @ts-ignore
      wrapper.vm.onClickSaveCategory(inputtedCategory);

      expect(actions.saveCategory).toHaveBeenCalledWith(
        expect.anything(),
        inputtedCategory,
        undefined
      );
    });

    it('calls store action "updateCategory" on onClickUpdateCategory()', () => {
      state.categories = [{ categoryId: 1, name: "テストカテゴリ" }];

      const wrapper = shallowMount(Stocks, { store, localVue, router });
      const editedCategory = "編集されたカテゴリ名";

      const updateCategoryPayload: IUpdateCategoryPayload = {
        stateCategory: state.categories[0],
        categoryName: editedCategory
      };

      // @ts-ignore
      wrapper.vm.onClickUpdateCategory(updateCategoryPayload);

      expect(actions.updateCategory).toHaveBeenCalledWith(
        expect.anything(),
        updateCategoryPayload,
        undefined
      );
    });

    it('calls store action "fetchCategory" on initializeCategory()', () => {
      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.initializeCategory();

      expect(actions.fetchCategory).toHaveBeenCalled();
    });

    it('calls store action "fetchStock" on initializeStock()', () => {
      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.initializeStock();

      expect(actions.fetchStock).toHaveBeenCalled();
    });

    it('calls store action "setIsCategorizing" on onSetIsCategorizing()', () => {
      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.onSetIsCategorizing();

      expect(actions.setIsCategorizing).toHaveBeenCalled();
    });

    it('calls store action "categorize" on onClickCategorize()', () => {
      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.onClickCategorize(1);

      const categorizePayload: ICategorizePayload = {
        categoryId: 1,
        stockArticleIds: []
      };

      expect(actions.categorize).toHaveBeenCalledWith(
        expect.anything(),
        categorizePayload,
        undefined
      );
    });

    it('calls store action "checkStock" on onClickCheckStock()', () => {
      const stock: IUncategorizedStock = {
        article_id: "c0a2609ae61a72dcc60f",
        title: "title1",
        user_id: "test-user1",
        profile_image_url: "https://test.com/test/image",
        article_created_at: "2018/09/30",
        tags: ["laravel", "php"],
        isChecked: true
      };

      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.onClickCheckStock(stock);

      expect(actions.checkStock).toHaveBeenCalledWith(
        expect.anything(),
        stock,
        undefined
      );
    });

    it('calls store action "fetchStock" on fetchOtherPageStock()', () => {
      const page: IPage = {
        page: 4,
        perPage: 20,
        relation: "next"
      };

      const wrapper = shallowMount(Stocks, { store, localVue, router });

      // @ts-ignore
      wrapper.vm.fetchOtherPageStock(page);

      expect(actions.fetchStock).toHaveBeenCalledWith(
        expect.anything(),
        page,
        undefined
      );
    });
  });

  // mountによる結合テスト
  describe("template", () => {
    it("should call onClickSaveCategory when button is clicked", () => {
      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        onClickSaveCategory: mock
      });

      const sideMenu = wrapper.find(SideMenu);
      const inputtedCategory = "inputtedCategory";

      // @ts-ignore
      sideMenu.vm.onClickSaveCategory(inputtedCategory);

      expect(mock).toHaveBeenCalledWith(inputtedCategory);
    });

    it("should call onClickUpdateCategory when button is clicked", () => {
      state.categories = [{ categoryId: 1, name: "テストカテゴリ" }];

      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        onClickUpdateCategory: mock
      });

      const categoryList = wrapper.find(CategoryList);
      const editedCategory = "編集されたカテゴリ名";

      const updateCategoryPayload: IUpdateCategoryPayload = {
        stateCategory: state.categories[0],
        categoryName: editedCategory
      };

      // @ts-ignore
      categoryList.vm.onClickUpdateCategory(updateCategoryPayload);

      expect(mock).toHaveBeenCalledWith(updateCategoryPayload);
    });

    it("should call onSetIsCategorizing when button is clicked", () => {
      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        onSetIsCategorizing: mock
      });

      const stockEdit = wrapper.find(StockEdit);

      // @ts-ignore
      stockEdit.vm.selectedCategoryId = 1;
      // @ts-ignore
      stockEdit.vm.changeCategory();

      expect(mock).toHaveBeenCalled();
    });

    it("should call onClickCategorize when button is clicked", () => {
      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        onClickCategorize: mock
      });

      const stockEdit = wrapper.find(StockEdit);
      const selectedCategoryId = 1;

      // @ts-ignore
      stockEdit.vm.selectedCategoryId = selectedCategoryId;
      // @ts-ignore
      stockEdit.vm.changeCategory();

      expect(mock).toHaveBeenCalledWith(selectedCategoryId);
    });

    it("should call onClickCheckStock when checkBox is clicked", () => {
      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        onClickCheckStock: mock
      });

      const stockList = wrapper.find(StockList);
      const stock: IUncategorizedStock = {
        article_id: "c0a2609ae61a72dcc60f",
        title: "title1",
        user_id: "test-user1",
        profile_image_url: "https://test.com/test/image",
        article_created_at: "2018/09/30",
        tags: ["laravel", "php"],
        isChecked: true
      };

      // @ts-ignore
      stockList.vm.onClickCheckStock(stock);

      expect(mock).toHaveBeenCalledWith(stock);
    });

    it("should call fetchOtherPageStock when pagination is clicked", () => {
      const mock = jest.fn();
      const wrapper = mount(Stocks, { store, localVue, router });

      wrapper.setMethods({
        fetchOtherPageStock: mock
      });

      const pagination = wrapper.find(Pagination);
      const page: IPage = {
        page: 4,
        perPage: 20,
        relation: "next"
      };

      // @ts-ignore
      pagination.vm.goToPage(page);

      expect(mock).toHaveBeenCalledWith(page);
    });
  });
});
