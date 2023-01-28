import { Subjects, ExpirationCompleteEvent, Publisher } from "@sitehub-website/common/build";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
};

