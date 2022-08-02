import clarity from 'clarity/dist';
import {
  CREATE,
} from '../../chat/constants';

// XXX ADD READ_PAGE to CHAT reducer and look for paging stuff

export default clarity
  .listen([
    CREATE,
  ])
  .initial({
    item: {},
  })
  .onUpdate((state, action) => {
    switch (action.type) {
      case CREATE:
        return {
          item: action.payload.participants[0],
        };
      default:
        return {};
    }
  });
