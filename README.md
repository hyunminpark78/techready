# OCP

## Project setup
```
npm install
```

## Extension 설치
- editorconfig
- eslint
- prettier
### VSCode 사용자의 경우
```
VSCode 실행 시 추천 확장 프로그램 설치 알림 확인
or
Extensions 패널에서 @recommended 검색 후 workspace recommendations 확인
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---

## 1. naming
```
    PascalCase : ComponentName 및 vue 파일명, Class 이름, 중요 모듈 이름
    kebab-case : template 내에 component 그리고 props, event
    camelCase : 변수명 및 함수명
      함수명 prefix로 동사를 사용한다 (get / set / add / delete / remove )
    UPPER_SNAKE_CASE : 상수
```
### <b> -. vue script내에 변수를 _또는 $를 사용하면 반응을 하지 않습니다. </b>
### -. event 
```
<template>
  <g-button @click="onClickChangePassword" /> <!-- on[Name][동작] -->
</template>
<script>
  {
    methods: {
      onClickChangePassword () {
        this.$emit('change-password') <g-change-password @change-password="onChangePassword" /> // 외부로 이벤트를 전달 할대에는 on을 뺀다
        this.$emit('changePassword')  <g-change-password @changePassword="onChangePassword" />
      // camelCase로 이벤트를 전달하면 kebab-case로 이벤트를 전달 받을 수 없음
      }
    }
  }
</script>
```
### -. services
```
  BillsServices.js : 파일명은 controller명으로 지정
  {
    // [httpMethod][API 경로][With][UrlParams And로 연결 ](UrlParams, {[queryString, postData] } // 샘플
    getCommonCodeGroupDetailWithCodeGroupIdAndCodeId(codeGroupId, codeId, { name, tel }) {
      return APICaller.get(`/api/v1/common-code/groups/${codeGroupId}/detail/${codeId}`, {
        name, tel
      })
    }
  }
```

## 2. development / production 환경별 변수
   config/dev.env.js // 개발자 환경
   config/test.env.js // 테스트 환경
   config/prod.env.js   // 라이브 환경
```
    VUE_APP_API_BASE_URL=https://ocp-ops2server-sandbox.dev.opsnow.com : 예시
```

## 3. vue script 내 위치
```
{
  name
  components
  ...$options
  props,
  mixin
  data
  computed
  method
  watch
  beforeCreate
  created
  beforeMounte
  mounted        // addEventListener dom이 생성 된후에 걸어야 하기 때문에 반드시 mounted에 걸어야 함
  beforeUpdate
  updated
  beforeDestroy  // removeEventListener는 dom이 제거 되기 전에 걸어야 하므로 반드시 beforeDestory에 걸어야 함
  destroyed
}
```
참고 : https://kr.vuejs.org/v2/guide/instance.html

## 4. filter
참고 : https://kr.vuejs.org/v2/guide/filters.html

## 5. prototype
```
	Object.defineProperty(Vue.prototype, '$pageName', {
		get () {
			return 'bespin'
		}
	})
```
참고 : https://kr.vuejs.org/v2/cookbook/adding-instance-properties.html

## 6. vuex
```
  {
    namespace: true
    state: {} // 초기값은 null이나 undefined를 사용하지 않습니다.
    // component에서 왠만하면 state에 바로 접근하지 말기
    getter: {} // state가 cache가 되어 속도가 빠름
    mutation: {} // 간단한 state 업데이트만 반영
    actions: {} // 긴 작업 또는 비동기 작업 여기서 진행 state 반영은 mutation에서
  }
```
  ### <b>** component 내에서는 mutations와 state에는 직접 접근하지 않는다</b>
  ### <b>** async와 관련된 작업은 모두 vuex의 action에서 진행</b>
  ### <b>** services에서 가져온 데이터는 원형 그대로 state에 저장 - 원형 그대로 저장하지 않을 경우 차후에 api 내용 변경이 있게 되면 복잡해짐</b>


## 7. bespin components
```
  ops2clientlibrary의 storybook을 참조 하여 확인
  실행방법 npm run storybook
  
```

### filter가 필요할 경우 getters에서 작업
```  
  getters : {
    articleListByBoardId: (state) => (boardId) => {
      return state.articleList.filter(item => item.boardId === boardId)
    }
  }
```
### <b>component에서 getter의 내용 수정이 필요 경우</b>
```
  import { cloneDeep } import 'loadsh'로 복사하여 data에 저장후 사용
  import { mapGetters, mapActions } import 'vuex'

  data () {
    return {
      cloneBoardInfo: {}
    }
  }
  computed: {
    ...mapGetters('board', ['boardInfo'])
  }
  methods: {
    ...mapActions('board', ['getBoardInfo'])
  }
  watch: {
    boardInfo (value) {
      this.cloneBoardInfo = cloneDeep(value)
    }
  }
  beforeMounted () {
    this.getBoardInfo()
  }
```

### vuex sample
board.js
```
  const types = {
    GET_ARTICLE_LIST: '@BOARD/GET_ARTICLE_LIST' // UPPER_SNAKE_CASE
    GET_BOARD_INFO: '@BOARD/GET_BOARD_INFO'
  }
  {
    namespaced: true
    state: {
      boardInfo: {},
      articleList: []
    },
    getters: {
      articleList (state) {
        return state.articleList
      },
      boardInfo (state) {
        return state.boardInfo
      }
    },
    mutations: {
      [types.GET_ARTICLE_LIST] (state, payload) {
        state.articleList = payload.articleList
      },
      [types.GET_BOARD_INFO] (state, payload) {
        state.boardInfo = payload.boardInfo
      }
    },
    actions: {
      async getArticleList ({ commit }, payload) {
        const response = await BoardServices.getArticleList(payload.boardId)
        commit(types.GET_ARTICLE_LIST], {
          articleList: response.data
        })
        return null // jest에서 동작하지 않을수 있어서 async는 마지막에 return 을 해줌
      },
      async getBoardInfo ({ commit }, payload) {
        const response = await BoardServices.getBoardInfo(payload.boardId)
        commit(types.GET_BOARD_INFO, {
          boardInfo: response.data
        })
        return null
      }
    }
  }
```

## i18n
	Path_PageName.Id
	Home_Index.1 // 숫자로도 되고 문자로도 사용


