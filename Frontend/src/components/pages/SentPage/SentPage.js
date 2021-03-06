import React from 'react'

import {PageWrapper} from '../PageWrapper'
import {MessageListPage} from '../MessageListPage'

const SentPage = () => (
  <PageWrapper title="Sent - Gmail">
    <MessageListPage listName='SENT'/>
  </PageWrapper>
);

export default SentPage;