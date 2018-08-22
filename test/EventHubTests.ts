import { IContent, Repository } from "@sensenet/client-core";
import { IODataBatchResponse } from "@sensenet/client-core/dist/Models/IODataBatchResponse";
import { IODataResponse } from "@sensenet/client-core/dist/Models/IODataResponse";
import { using } from "@sensenet/client-utils";
import { ChoiceFieldSetting, FieldSetting, FieldVisibility, ShortTextFieldSetting, Task, User } from "@sensenet/default-content-types";
import { expect } from "chai";
import { EventHub } from "../src";

/**
 * Unit tests for the Repository Event Hub
 */
export const eventHubTests = describe("EventHub", () => {
    let repository: Repository;
    let eventHub: EventHub;

    const mockContent = {
        Id: 123,
        Name: "mook",
        Path: "Root/Example",
    } as IContent;

    beforeEach(() => {
        repository = new Repository({}, async () => ({ ok: true } as any));
        eventHub = new EventHub(repository);
    });

    afterEach(() => {
        repository.dispose();
        eventHub.dispose();
    });

    it("should be constructed", () => {
        expect(eventHub).to.be.instanceOf(EventHub);
    });

    it("should be disposed", () => {
        eventHub.dispose();
    });

    describe("Content Created", () => {
        it("should be triggered after post", (done: MochaDone) => {
            eventHub.onContentCreated.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: mockContent,
                    } as IODataResponse<IContent>;
                },
            }) as any;
            repository.post({
                parentPath: "",
                contentType: "User",
                content: mockContent,
            });
        });

        it("fail should be trigger after post failed", (done: MochaDone) => {
            eventHub.onContentCreateFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
                json: async () => {
                    return {content: mockContent};
                },
            }) as any;

            (async () => {
                try {
                    const response = await repository.post({
                        parentPath: "",
                        contentType: "User",
                        content: mockContent,
                    });
                } catch {
                    // ignore...
                }
            })();
        });

        it("should be trigger after copy", (done: MochaDone) => {
            eventHub.onContentCopied.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            errors: [],
                            results: [mockContent],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.copy({
                idOrPath: 123,
                rootContent: mockContent,
                targetPath: "Root/Example/Target/Path",
            });
        });

        it("should trigger failed after copy failed", (done: MochaDone) => {
            eventHub.onContentCopyFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            errors: [{error: "error", content: mockContent}],
                            results: [],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.copy({
                idOrPath: 123,
                rootContent: mockContent,
                targetPath: "Root/Example/Target/Path",
            });
        });

        it("should trigger failed if copyBatch operation has been failed ", (done: MochaDone) => {
            eventHub.onContentCopyFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Id: 321});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const deleteResponse = await repository.copy({
                        targetPath: "Root/Example/Target",
                        idOrPath: 321,
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });

        it("should trigger failed if copyBatch operation has been failed with an array of pathes", (done: MochaDone) => {
            eventHub.onContentCopyFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Path: "Root/Example/Path1"});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const deleteResponse = await repository.copy({
                        targetPath: "Root/Example/Target",
                        idOrPath: ["Root/Example/Path1"],
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });
    });

    describe("Content Modified", () => {
        it("should be trigger after patch", (done: MochaDone) => {
            eventHub.onContentModified.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: mockContent,
                    } as IODataResponse<IContent>;
                },
            }) as any;
            repository.patch({
                idOrPath: 123,
                content: mockContent,
            });
        });

        it("fail should be triggered after patch failed", (done: MochaDone) => {
            eventHub.onContentModificationFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
                json: async () => {
                    return {content: mockContent};
                },
            }) as any;

            (async () => {
                try {
                    const response = await repository.patch({
                        content: mockContent,
                        idOrPath: 123,
                    });
                } catch {
                    // ignore...
                }
            })();
        });

        it("should be trigger after put", (done: MochaDone) => {
            eventHub.onContentModified.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: mockContent,
                    } as IODataResponse<IContent>;
                },
            }) as any;
            repository.put({
                idOrPath: 123,
                content: mockContent,
            });
        });
    });

    it("fail should be triggered after put failed", (done: MochaDone) => {
        eventHub.onContentModificationFailed.subscribe((c) => {
            expect(c.content).to.be.deep.eq(mockContent);
            done();
        });
        // tslint:disable-next-line:no-string-literal
        repository["fetch"] = async () => ({
            ok: false,
            json: async () => {
                return {content: mockContent};
            },
        }) as any;

        (async () => {
            try {
                const response = await repository.put({
                    content: mockContent,
                    idOrPath: 123,
                });
            } catch {
                // ignore...
            }
        })();
    });

    describe("Content Deleted", () => {
        it("should be triggered after delete", (done: MochaDone) => {
            eventHub.onContentDeleted.subscribe((c) => {
                expect(c.contentData).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [mockContent],
                            errors: [],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.delete({
                idOrPath: 123,
            });
        });

        it("failed should be triggered after delete succeed with errors", (done: MochaDone) => {
            eventHub.onContentDeleteFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [],
                            errors: [{
                                error: "alma",
                                content: mockContent,
                            }],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.delete({
                idOrPath: 123,
            });
        });

        it("failed should be triggered if deleteBatch operation has been failed", (done: MochaDone) => {
            eventHub.onContentDeleteFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Id: 123});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const deleteResponse = await repository.delete({
                        idOrPath: 123,
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });

        it("failed should be triggered if deleteBatch operation has been failed with an array of pathes", (done: MochaDone) => {
            eventHub.onContentDeleteFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Path: "Root/Example/Path1"});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const deleteResponse = await repository.delete({
                        idOrPath: ["Root/Example/Path1"],
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });
    });

    describe("Content Move", () => {
        it("should be triggered after move", (done: MochaDone) => {
            eventHub.onContentMoved.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [mockContent],
                            errors: [],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.move({
                idOrPath: 123,
                targetPath: "Root/Example/TargetPath",
            });
        });

        it("failed should be triggered after move succeed with errors", (done: MochaDone) => {
            eventHub.onContentMoveFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq(mockContent);
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: true,
                json: async () => {
                    return {
                        d: {
                            __count: 1,
                            results: [],
                            errors: [{
                                error: "alma",
                                content: mockContent,
                            }],
                        },
                    } as IODataBatchResponse<IContent>;
                },
            }) as any;
            repository.move({
                targetPath: "Root/Example",
                idOrPath: 123,
            });
        });

        it("failed should be triggered if moveBatch operation has been failed", (done: MochaDone) => {
            eventHub.onContentMoveFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Id: 123});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const deleteResponse = await repository.move({
                        idOrPath: 123,
                        targetPath: "Root/Example",
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });

        it("failed should be triggered if moveBatch operation has been failed with an array of pathes", (done: MochaDone) => {
            eventHub.onContentMoveFailed.subscribe((c) => {
                expect(c.content).to.be.deep.eq({Path: "Root/Example/Path1"});
                done();
            });
            // tslint:disable-next-line:no-string-literal
            repository["fetch"] = async () => ({
                ok: false,
            }) as any;
            (async () => {
                try {
                    const moveResponse = await repository.move({
                        idOrPath: ["Root/Example/Path1"],
                        targetPath: "Root/Example/Target",
                    });
                } catch (error) {
                    /** ignore */
                }
            })();
        });
    });

});
